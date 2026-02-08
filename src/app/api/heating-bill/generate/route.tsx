import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import path from "path";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import database from "@/db";
import { documents } from "@/db/drizzle/schema";
import { logger } from "@/utils/logger";
import { supabaseServer } from "@/utils/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import HeidiSystemsPdfServer from "@/components/Admin/Docs/Render/HeidiSystemsPdf/HeidiSystemsPdfServer";
import {
	getHeatingBillDocumentByID,
	getObjectById,
	getAdminUserData,
	getLocalById,
	getRelatedLocalsByObjektId,
	getHeatingInvoicesByHeatingBillDocumentID,
	getDocCostCategoryTypes,
	getContractsWithContractorsByLocalID,
} from "@/api";
import type {
	EnergyConsumptionData,
	EnergyConsumptionLineItem,
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
		const [
			settlementDoc,
			building,
			apartment,
			allApartments,
			invoices,
			costCategories,
			contractsWithContractors,
		] = await Promise.all([
			getHeatingBillDocumentByID(documentId),
			getObjectById(objektId),
			getLocalById(apartmentId),
			getRelatedLocalsByObjektId(objektId),
			getHeatingInvoicesByHeatingBillDocumentID(documentId, "fuel_costs"),
			getDocCostCategoryTypes("heizkostenabrechnung"),
			getContractsWithContractorsByLocalID(apartmentId),
		]);

		// 4. Validate required data exists
		if (!settlementDoc) {
			return NextResponse.json(
				{ error: "Dokument nicht gefunden", code: "DOCUMENT_NOT_FOUND" },
				{ status: 404 },
			);
		}

		if (!building) {
			return NextResponse.json(
				{ error: "Objekt nicht gefunden", code: "BUILDING_NOT_FOUND" },
				{ status: 404 },
			);
		}

		if (!apartment) {
			return NextResponse.json(
				{ error: "Wohnung nicht gefunden", code: "APARTMENT_NOT_FOUND" },
				{ status: 404 },
			);
		}

		// 5. Fetch owner data (depends on building result)
		const owner = await getAdminUserData(building.user_id);

		if (!owner) {
			return NextResponse.json(
				{ error: "Benutzer nicht gefunden", code: "USER_NOT_FOUND" },
				{ status: 404 },
			);
		}

		// 6. Calculate total living space from all apartments
		const totalLivingSpace = allApartments.reduce(
			(sum, apt) => sum + (Number(apt.living_space) || 0),
			0,
		);

		// 7. Get logo path for PDF
		const logoSrc = path.join(process.cwd(), "public/admin_logo.png");

		// 8. Build energy consumption from fuel invoices (pre-filtered at query level)
		const energyConsumption = buildEnergyConsumption(invoices);

		// 9. Build props for PDF component (matching HeatingBillPreviewProps)
		const pdfProps = {
			mainDoc: settlementDoc as any,
			local: apartment as any,
			user: owner as any,
			objekt: building as any,
			totalLivingSpace,
			costCategories: costCategories as any[],
			invoices: invoices as any[],
			contracts: contractsWithContractors as any[],
			logoSrc,
			energyConsumption,
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
				document_name: `Heizkostenabrechnung_${apartment.floor || "Apartment"}.pdf`,
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
