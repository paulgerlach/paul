import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import path from "path";
import fs from "fs";
import { differenceInDays } from "date-fns";
import { parseCsv } from "@/utils/parser";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import database from "@/db";
import { documents } from "@/db/drizzle/schema";
import { logger } from "@/utils/logger";
import { supabaseServer } from "@/utils/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import HeidiSystemsPdfServer from "@/components/Admin/Docs/Render/HeidiSystemsPdf/HeidiSystemsPdfServer";
import {
	getLocalById,
	getHeatingInvoicesByHeatingBillDocumentID,
	getDocCostCategoryTypes,
	getContractsWithContractorsByLocalID,
	getHeatBillingGeneralInfo,
	MeterReadingType,
} from "@/api";
import type {
	EnergyConsumptionData,
	EnergyConsumptionLineItem,
	AdditionalCostsData,
	AdditionalCostLineItem,
} from "@/components/Admin/Docs/Render/HeatingBillPreview/HeatingBillPreview";
import type { InvoiceDocumentType } from "@/types";

/**
 * Build energy consumption data from fuel cost invoices for PDF display.
 * Invoices are pre-filtered by cost_type at query level.
 */
function buildEnergyConsumption(
	fuelInvoices: InvoiceDocumentType[],
): EnergyConsumptionData {
	// Create line items for each fuel invoice
	const lineItems: EnergyConsumptionLineItem[] = fuelInvoices.map(
		(invoice) => ({
			position: invoice.document_name
				? `Rechnung\n${invoice.document_name.split("-")[1]}`
				: invoice.purpose || "Energiekosten",
			date: invoice.invoice_date || undefined,
			kwh: invoice.notes ?? "", // added as a remark on the invoice
			amount: Number(invoice.total_amount ?? 0),
		}),
	);

	// Calculate totals
	const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);

	return {
		energyType: "Nah-/Fernwärme kWh",
		lineItems,
		totalKwh: "",
		totalAmount,
	};
}

/**
 * Build additional costs data from non-fuel invoices.
 */
function buildAdditionalCosts(
	otherInvoices: InvoiceDocumentType[],
): AdditionalCostsData {
	const lineItems: AdditionalCostLineItem[] = otherInvoices.map((invoice) => ({
		position: invoice.purpose || invoice.cost_type || "Sonstige Kosten",
		date: invoice.invoice_date || undefined,
		amount: Number(invoice.total_amount ?? 0),
		costType: invoice.cost_type || undefined,
	}));

	const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);

	return {
		lineItems,
		totalAmount,
	};
}

// Helper types for consumption calculation
type DataPoint = {
	date: Date;
	value: number;
	unit: string;
};

type ConsumptionResult = {
	consumption: number;
	startValue: number | null;
	endValue: number | null;
	startDate: Date | null;
	endDate: Date | null;
	unit: string;
	error?: string;
};

function calculateMeterConsumption(
	readings: MeterReadingType[],
	targetStartDate: Date,
	targetEndDate: Date,
): ConsumptionResult {
	// 1. Flatten all readings into data points
	let allPoints: DataPoint[] = [];

	readings.forEach((r) => {
		const unitMap: Record<string, string> = {
			Wh: "kWh",
			kWh: "kWh",
			"m^3": "m³",
			m3: "m³",
		};

		// Helper to add point
		const addPoint = (
			dateStr: string | undefined,
			val: number | undefined,
			originalUnit: string | undefined,
		) => {
			if (!dateStr || val === undefined) return;

			let date: Date;
			// Handle different date formats including German DD.MM.YYYY
			if (dateStr.includes(".")) {
				const [day, month, year] = dateStr.split(".");
				date = new Date(`${year}-${month}-${day}`);
			} else {
				date = new Date(dateStr);
			}

			if (isNaN(date.getTime())) return;

			let value = val;
			let unit = unitMap[originalUnit || ""] || originalUnit || "";

			// Convert Wh to kWh if needed
			if (originalUnit === "Wh") {
				value = value / 1000;
			}

			allPoints.push({ date, value, unit });
		};

		// Extract from various possible fields (replicating consumption-calculator logic)
		// Standard fields
		addPoint(r["Actual Date"], r["Actual Volume"] as number, r["Actual Unit"]);
		addPoint(
			r["Actual Date"],
			r["Actual Energy / HCA"] as number,
			r["Actual Unit"],
		);

		// CSV fields (IV,x,...)
		if (r["IV,0,0,0,,Date/Time"])
			addPoint(
				String(r["IV,0,0,0,,Date/Time"]).split(" ")[0],
				r["IV,0,0,0,m^3,Vol"],
				"m^3",
			);
		if (r["IV,0,0,0,,Date/Time"])
			addPoint(
				String(r["IV,0,0,0,,Date/Time"]).split(" ")[0],
				r["IV,0,0,0,Wh,E"],
				"Wh",
			);
	});

	// 2. Sort by date
	allPoints.sort((a, b) => a.date.getTime() - b.date.getTime());

	// Deduplicate points (same date)
	const uniquePoints: DataPoint[] = [];
	const seenDates = new Set<number>();

	allPoints.forEach((p) => {
		const time = p.date.getTime();
		if (!seenDates.has(time)) {
			uniquePoints.push(p);
			seenDates.add(time);
		}
	});
	allPoints = uniquePoints;

	if (allPoints.length === 0) {
		return {
			consumption: 0,
			startValue: null,
			endValue: null,
			startDate: null,
			endDate: null,
			unit: "",
			error: "No data points found",
		};
	}

	// 3. Find closest points to start and end
	const getClosest = (target: Date) => {
		let closest = allPoints[0];
		let minDiff = Math.abs(differenceInDays(target, closest.date));

		for (let i = 1; i < allPoints.length; i++) {
			const diff = Math.abs(differenceInDays(target, allPoints[i].date));
			if (diff < minDiff) {
				minDiff = diff;
				closest = allPoints[i];
			}
		}
		return { point: closest, diff: minDiff };
	};

	const startMatch = getClosest(targetStartDate);
	const endMatch = getClosest(targetEndDate);

	const unit = endMatch.point.unit || startMatch.point.unit || "";

	return {
		consumption: endMatch.point.value - startMatch.point.value,
		startValue: startMatch.point.value,
		endValue: endMatch.point.value,
		startDate: startMatch.point.date,
		endDate: endMatch.point.date,
		unit,
	};
}

async function buildConsumption(
	allApartments: any[],
	settlementDoc: any,
	objektId: string,
) {
	const allMeterIds = allApartments.flatMap((local) => local.meter_ids || []);
	// Validate meter IDs similar to dashboard-data
	const validMeterIds = allMeterIds.filter(
		(id): id is string => typeof id === "string" && id !== "",
	);

	let buildingConsumption = {
		heat: { consumption: 0, startValue: 0, endValue: 0, unit: "kWh" },
		hotWater: { consumption: 0, startValue: 0, endValue: 0, unit: "m³" },
		coldWater: { consumption: 0, startValue: 0, endValue: 0, unit: "m³" },
	};

	const startDate = settlementDoc.start_date
		? new Date(settlementDoc.start_date)
		: null;
	const endDate = settlementDoc.end_date
		? new Date(settlementDoc.end_date)
		: null;

	if (validMeterIds.length > 0 && startDate && endDate) {
		const supabase = await supabaseServer();
		const startDateStr = startDate.toISOString().split("T")[0];
		const endDateStr = endDate.toISOString().split("T")[0];
		const requestedDeviceTypes = [
			"Heat",
			"HeatCostAllocator",
			"WWater",
			"Water",
		];

		// Utilized logic from dashboard-data/route.ts
		const { data: parsedData, error: rpcError } = await supabase.rpc(
			"get_dashboard_data",
			{
				p_local_meter_ids: validMeterIds,
				p_device_types: requestedDeviceTypes,
				p_start_date: startDateStr,
				p_end_date: endDateStr,
			},
		);

		if (rpcError) {
			logger.error("Failed to fetch dashboard data via RPC", {
				error: rpcError,
			});
		} else {
			// Transform (Inline logic from dashboard-data/route.ts)
			const meterReadings: MeterReadingType[] = parsedData
				? parsedData.map((record: any) => {
						const parsedDataJson = record.parsed_data;

						return {
							"Frame Type":
								record.frame_type || parsedDataJson["Frame Type"] || "",
							Manufacturer:
								record.manufacturer || parsedDataJson["Manufacturer"] || "",
							ID: record.device_id,
							Version: record.version || parsedDataJson["Version"] || "",
							"Device Type": record.device_type,
							"TPL-Config": parsedDataJson["TPL-Config"] || "",
							"Access Number":
								record.access_number || parsedDataJson["Access Number"] || 0,
							Status: record.status || parsedDataJson["Status"] || "",
							Encryption:
								record.encryption || parsedDataJson["Encryption"] || 0,
							...parsedDataJson, // Include all the original measurement columns
						} as MeterReadingType;
					})
				: [];

			// Filter Logic from dashboard-data/route.ts
			// "Filter by device types ONLY if specific ones were requested"
			// "Otherwise, allow all data that has a valid date field"
			const filteredData = meterReadings.filter((item) => {
				// Check for date existence (logic from dashboard-data)
				const hasDate =
					item["IV,0,0,0,,Date/Time"] ||
					item["Actual Date"] ||
					item["Raw Date"];
				if (!hasDate) return false;

				// Filter by type
				if (requestedDeviceTypes.length === 0) return true;
				return requestedDeviceTypes.includes(item["Device Type"]);
			});

			// Group readings by meter ID
			const readingsByMeter = new Map<string, typeof meterReadings>();

			filteredData.forEach((reading) => {
				const id = String(reading.ID || reading["Number Meter"]);
				if (!readingsByMeter.has(id)) {
					readingsByMeter.set(id, [] as typeof meterReadings);
				}
				readingsByMeter.get(id)?.push(reading);
			});

			// Calculate consumption for each meter
			for (const [meterId, readings] of readingsByMeter.entries()) {
				const result = calculateMeterConsumption(readings, startDate, endDate);
				const deviceType = readings[0]["Device Type"]; // Assume consistent type for a meter ID

				if (deviceType === "Heat" || deviceType === "HeatCostAllocator") {
					buildingConsumption.heat.consumption += result.consumption;
					buildingConsumption.heat.startValue += result.startValue || 0;
					buildingConsumption.heat.endValue += result.endValue || 0;
					if (result.unit) buildingConsumption.heat.unit = result.unit;
				} else if (deviceType === "WWater") {
					buildingConsumption.hotWater.consumption += result.consumption;
					buildingConsumption.hotWater.startValue += result.startValue || 0;
					buildingConsumption.hotWater.endValue += result.endValue || 0;
					if (result.unit) buildingConsumption.hotWater.unit = result.unit;
				} else if (deviceType === "Water") {
					buildingConsumption.coldWater.consumption += result.consumption;
					buildingConsumption.coldWater.startValue += result.startValue || 0;
					buildingConsumption.coldWater.endValue += result.endValue || 0;
					if (result.unit) buildingConsumption.coldWater.unit = result.unit;
				}
			}

			logger.info("Building Consumption Calculated", {
				objektId,
				period: { start: startDate, end: endDate },
				consumption: buildingConsumption,
			});
		}
	}

	return {
		objektId,
		period: { start: startDate, end: endDate },
		consumption: buildingConsumption,
	};
}

async function buildConsumptionFromCsv(
	allApartments: any[],
	settlementDoc: any,
	objektId: string,
) {
	const csvFileName = "Worringerestrasse86_20251215_20251217 (1).csv";
	const csvPath = path.join(
		process.cwd(),
		"src/app/api/heating-bill/generate",
		csvFileName,
	);

	let buildingConsumption = {
		heat: { consumption: 0, startValue: 0, endValue: 0, unit: "kWh" },
		hotWater: { consumption: 0, startValue: 0, endValue: 0, unit: "m³" },
		coldWater: { consumption: 0, startValue: 0, endValue: 0, unit: "m³" },
	};

	const startDate = settlementDoc.start_date
		? new Date(settlementDoc.start_date)
		: null;
	const endDate = settlementDoc.end_date
		? new Date(settlementDoc.end_date)
		: null;

	if (fs.existsSync(csvPath) && startDate && endDate) {
		const fileContent = fs.readFileSync(csvPath, "utf-8");
		const { data: parsedData, errors } = parseCsv(fileContent);

		if (errors.length > 0) {
			console.warn("CSV parsing errors:", errors);
		}

		// Apply same filtering as dashboard-data logic
		const allMeterIds = allApartments.flatMap((local) => local.meter_ids || []);
		const validMeterIds = allMeterIds.filter(
			(id): id is string => typeof id === "string" && id !== "",
		);
		const requestedDeviceTypes = [
			"Heat",
			"HeatCostAllocator",
			"WWater",
			"Water",
		];

		const filteredData = parsedData.filter((item) => {
			// Check for date: parseCsv outputs "IV,0,0,0,,Date/Time" or "IV,1,0,0,,Date"
			// My calculateMeterConsumption uses "Actual Date" (from my transform) OR "IV,0,0,0,,Date/Time" (from CSV keys)
			const hasDate = item["IV,0,0,0,,Date/Time"] || item["IV,1,0,0,,Date"];
			if (!hasDate) return false;

			// Filter by Device Type
			if (!requestedDeviceTypes.includes(item["Device Type"])) return false;

			// Filter by Meter ID? User said "utilize the same logic... instead of rpc method... use this csv file"
			// RPC method filtered by ID. So we should filter by ID here too.
			// But CSV uses "ID" or "ID" column. `parseCsv` sets `ID`.
			if (
				validMeterIds.length > 0 &&
				!validMeterIds.includes(String(item.ID))
			) {
				return false;
			}

			return true;
		});

		// Group by Meter ID
		const readingsByMeter = new Map<string, typeof parsedData>();

		filteredData.forEach((reading) => {
			const id = String(reading.ID);
			if (!readingsByMeter.has(id)) {
				readingsByMeter.set(id, [] as typeof parsedData);
			}
			// Cast to compatible type for calculation helper
			// calculateMeterConsumption expects MeterReadingType which includes mapped fields (Actual *).
			// But parseCsv returns raw fields.
			// calculateMeterConsumption handles raw fields too! (Added in Step 1170: "CSV fields (IV,x...)")
			readingsByMeter.get(id)?.push(reading);
		});

		// Calculate
		for (const [meterId, readings] of readingsByMeter.entries()) {
			const result = calculateMeterConsumption(
				readings as any[], // Casting because mixed types (my definition vs parser definition)
				startDate,
				endDate,
			);
			const deviceType = readings[0]["Device Type"];

			if (deviceType === "Heat" || deviceType === "HeatCostAllocator") {
				buildingConsumption.heat.consumption += result.consumption;
				buildingConsumption.heat.startValue += result.startValue || 0;
				buildingConsumption.heat.endValue += result.endValue || 0;
				if (result.unit) buildingConsumption.heat.unit = result.unit;
			} else if (deviceType === "WWater") {
				buildingConsumption.hotWater.consumption += result.consumption;
				buildingConsumption.hotWater.startValue += result.startValue || 0;
				buildingConsumption.hotWater.endValue += result.endValue || 0;
				if (result.unit) buildingConsumption.hotWater.unit = result.unit;
			} else if (deviceType === "Water") {
				buildingConsumption.coldWater.consumption += result.consumption;
				buildingConsumption.coldWater.startValue += result.startValue || 0;
				buildingConsumption.coldWater.endValue += result.endValue || 0;
				if (result.unit) buildingConsumption.coldWater.unit = result.unit;
			}
		}

		logger.info("Building Consumption Calculated from CSV", {
			objektId,
			period: { start: startDate, end: endDate },
			consumption: buildingConsumption,
			readingsCount: filteredData.length,
		});
	} else {
		console.warn("CSV file not found or dates missing:", csvPath);
	}

	return {
		objektId,
		period: { start: startDate, end: endDate },
		consumption: buildingConsumption,
	};
}

/**
 * Request validation schema for heating bill PDF generation.
 */
const RequestSchema = z.object({
	documentId: z.string().uuid("documentId must be a valid UUID"),
	objektId: z.string().uuid("objektId must be a valid UUID"),
	apartmentId: z.string().uuid("apartmentId must be a valid UUID"),
});

export type GenerateHeatingBillRequest = z.infer<typeof RequestSchema>;

/**
 * POST /api/heating-bill/generate
 *
 * Generates a heating bill PDF for a specific apartment within a settlement.
 * - Fetches all required data (building, apartment, invoices, contracts, etc.)
 * - Renders PDF server-side using @react-pdf/renderer
 * - Uploads to Supabase storage
 * - Stores reference in documents table
 * - Returns the PDF URL
 */
export async function POST(request: NextRequest) {
	try {
		// 1. Authentication check
		const user = await getAuthenticatedServerUser();
		if (!user || !user.id) {
			return NextResponse.json(
				{ error: "Nicht authentifiziert", code: "UNAUTHORIZED" },
				{ status: 401 },
			);
		}

		// 2. Parse and validate request body
		const body = await request.json();
		const validation = RequestSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{
					error: "Ungültige Anfrage",
					code: "VALIDATION_ERROR",
					details: validation.error.issues,
				},
				{ status: 400 },
			);
		}

		const { documentId, objektId, apartmentId } = validation.data;

		// 3. Fetch all required data in parallel using existing API methods
		const [contractsWithContractors, generalInfo, invoices, costCategories] =
			await Promise.all([
				getContractsWithContractorsByLocalID(apartmentId),
				getHeatBillingGeneralInfo(documentId),
				getHeatingInvoicesByHeatingBillDocumentID(documentId),
				getDocCostCategoryTypes("heizkostenabrechnung"),
			]);

		// 4. Validate required data exists
		if (!generalInfo) {
			return NextResponse.json(
				{ error: "Dokument nicht gefunden", code: "DOCUMENT_NOT_FOUND" },
				{ status: 404 },
			);
		}

		// 7. Get logo path for PDF
		const logoSrc = path.join(process.cwd(), "public/admin_logo.png");

		// 8. Split invoices into fuel and non-fuel
		const fuelInvoices = invoices.filter(
			(inv) => inv.cost_type === "fuel_costs",
		);
		const otherInvoices = invoices.filter(
			(inv) => inv.cost_type !== "fuel_costs",
		);

		// 9. Build energy consumption and additional costs
		const energyConsumption = buildEnergyConsumption(fuelInvoices);

		// Split other invoices by cost_type
		const HEAT_RELATED_TYPES = [
			"hot_water_supply",
			"hot_water",
			"heating_costs",
		];

		const heatRelatedInvoices = otherInvoices.filter(
			(inv) => inv.cost_type && HEAT_RELATED_TYPES.includes(inv.cost_type),
		);
		const otherOperatingInvoices = otherInvoices.filter(
			(inv) => !inv.cost_type || !HEAT_RELATED_TYPES.includes(inv.cost_type),
		);

		const heatRelatedCosts = buildAdditionalCosts(heatRelatedInvoices);
		const otherOperatingCosts = buildAdditionalCosts(otherOperatingInvoices);

		// 11. Calculate Building-Level Consumption (Iteration 4)
		// Experiment: Use CSV Data
		// const consumptionData = await buildConsumptionFromCsv(
		// 	allApartments,
		// 	settlementDoc,
		// 	objektId,
		// );

		// Mock consumption data for now (No readings yet)
		const mockConsumptionData = {
			objektId,
			period: {
				start: generalInfo.billingStartDate
					? new Date(generalInfo.billingStartDate)
					: null,
				end: generalInfo.billingEndDate
					? new Date(generalInfo.billingEndDate)
					: null,
			},
			consumption: {
				heat: {
					consumption: 15000,
					startValue: 1000,
					endValue: 16000,
					unit: "kWh",
				},
				hotWater: {
					consumption: 500,
					startValue: 100,
					endValue: 600,
					unit: "m³",
				},
				coldWater: {
					consumption: 800,
					startValue: 200,
					endValue: 1000,
					unit: "m³",
				},
			},
		};
		const consumptionData = mockConsumptionData;

		/*
		const consumptionData = await buildConsumption(
			allApartments,
			settlementDoc,
			objektId,
		);
		*/
		const additionalCosts = buildAdditionalCosts(otherInvoices);
		const totalHeatingCosts =
			energyConsumption.totalAmount +
			heatRelatedCosts.totalAmount +
			otherOperatingCosts.totalAmount;

		// 10. Build props for PDF component (matching HeatingBillPreviewProps)
		const pdfProps = {
			generalInfo,
			costCategories: costCategories as any[],
			invoices: invoices as any[],
			contracts: contractsWithContractors as any[],
			logoSrc,
			energyConsumption,
			additionalCosts, // Deprecated prop, kept for compatibility if needed
			heatRelatedCosts,
			otherOperatingCosts,
			totalHeatingCosts,
		};

		logger.info("Generating PDF server-side", {
			documentId,
			apartmentId,
			invoiceCount: invoices.length,
			contractCount: contractsWithContractors.length,
		});

		// 12. Render PDF to buffer server-side
		const pdfBuffer = await renderToBuffer(
			<HeidiSystemsPdfServer {...pdfProps} />,
		);

		// 13. Upload to Supabase storage
		const supabase = await supabaseServer();
		const fileName = `heating_bill_${apartmentId}_${Date.now()}.pdf`;
		const storagePath = `${user.id}/${fileName}`;

		const { data: uploadData, error: uploadError } = await supabase.storage
			.from("documents")
			.upload(storagePath, pdfBuffer, {
				contentType: "application/pdf",
				upsert: true,
			});

		if (uploadError) {
			logger.error("Failed to upload PDF to storage", { error: uploadError });
			return NextResponse.json(
				{
					error: "Upload fehlgeschlagen",
					code: "UPLOAD_FAILED",
					message: uploadError.message,
				},
				{ status: 500 },
			);
		}

		// 14. Insert document record
		const [documentRecord] = await database
			.insert(documents)
			.values({
				document_name: `Heizkostenabrechnung_${apartmentId || "Apartment"}.pdf`,
				document_url: storagePath,
				related_id: documentId,
				related_type: "heating_bill",
				user_id: user.id,
			})
			.returning();

		// 15. Get signed URL for the document (bucket is private)
		const { data: urlData, error: urlError } = await supabase.storage
			.from("documents")
			.createSignedUrl(storagePath, 60 * 60); // 1 hour expiry

		if (urlError) {
			logger.error("Failed to create signed URL", { error: urlError });
			return NextResponse.json(
				{
					error: "URL-Erstellung fehlgeschlagen",
					code: "URL_FAILED",
					message: urlError.message,
				},
				{ status: 500 },
			);
		}

		logger.info("PDF generated and uploaded successfully", {
			documentId: documentRecord.id,
			storagePath,
			signedUrl: urlData.signedUrl,
		});

		return NextResponse.json({
			success: true,
			message: "PDF erfolgreich generiert",
			data: {
				documentId: documentRecord.id,
				documentPath: storagePath,
				publicUrl: urlData.signedUrl,
				fileName,
				consumptionData,
				heatRelatedCosts,
				otherOperatingCosts,
			},
		});
	} catch (error) {
		console.error("Error in heating bill generation:", error);
		return NextResponse.json(
			{
				error: "Interner Serverfehler",
				code: "INTERNAL_ERROR",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
