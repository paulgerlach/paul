"use server";

import database from "@/db";
import {
    heating_bill_documents,
    objekte,
    locals,
    contracts,
    invoice_documents,
    contractors,
    users,
    local_meters,
    doc_cost_category,
    documents,
} from "@/db/drizzle/schema";
import { eq, and, lte, gte, inArray } from "drizzle-orm";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { supabaseServer } from "@/utils/supabase/server";
import { MeterReadingType } from "@/api";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import HeidiSystemsPdf from "@/components/Admin/Docs/Render/HeidiSystemsPdf/HeidiSystemsPdf";
import path from "path";
import fs from "fs";

// Define the return type for the server action
export type GenerateHeatingBillResult = {
    success: boolean;
    url?: string;
    error?: string;
};

// Define the interface for the calculated data that will be passed to the PDF components
// This matches the "CalculatedBillData" from the implementation plan
export interface CalculatedBillData {
    mainDoc: typeof heating_bill_documents.$inferSelect;
    objekt: typeof objekte.$inferSelect;
    local: typeof locals.$inferSelect;
    user: typeof users.$inferSelect;
    // We might need to extend these types with relations if not using the inferred types directly for relations
    contracts: (typeof contracts.$inferSelect & { contractors: typeof contractors.$inferSelect[] })[];
    invoices: typeof invoice_documents.$inferSelect[];
    costCategories: typeof doc_cost_category.$inferSelect[];
    readings: MeterReadingType[]; // Explicit list of readings

    // Calculated fields
    totalLivingSpace: number;
    totalBuildingConsumption: Record<string, number>; // e.g., { 'Heat': 10000, 'Water': 500 }

    // Per-unit calculated arrays
    unitCostDistribution: {
        category: string;
        fixedCost: number;
        variableCost: number;
        total: number;
    }[];

    logoPath?: string;
}


// Mock Data Injection Function
const getMockReadings = (meterIds: string[], startDate: string, endDate: string): MeterReadingType[] => {
    // Generate mock readings for testing
    // We need pairs of readings (Start and End) for each meter to calculate consumption
    const readings: MeterReadingType[] = [];

    meterIds.forEach(id => {
        // Mock Heat Meter
        readings.push({
            "ID": id,
            "Device Type": "Heat",
            "Access Number": 1,
            "Status": "OK",
            "Encryption": 0,
            "IV,0,0,0,,Date/Time": startDate,
            "Actual Date": startDate,
            "Volume": 1000,
            "Energy": 5000,
        } as unknown as MeterReadingType);

        readings.push({
            "ID": id,
            "Device Type": "Heat",
            "Access Number": 2,
            "Status": "OK",
            "Encryption": 0,
            "IV,0,0,0,,Date/Time": endDate,
            "Actual Date": endDate,
            "Volume": 1100, // +100 Volume
            "Energy": 5500, // +500 Energy
        } as unknown as MeterReadingType);
    });

    return readings;
};

// Helper to group invoices
const groupInvoicesByType = (invoices: typeof invoice_documents.$inferSelect[]) => {
    return invoices.reduce((acc, invoice) => {
        const type = invoice.cost_type || 'other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(invoice);
        return acc;
    }, {} as Record<string, typeof invoice_documents.$inferSelect[]>);
};

// Helper to calculate consumption from readings
const calculateConsumption = (readings: MeterReadingType[], meterId: string, startDate: string, endDate: string) => {
    // Find reading closest to start and end
    // Simple logic: Exact match or first/last in sorted list
    // This requires robust date parsing matching the format in readings
    const meterReadings = readings.filter(r => r.ID === meterId);

    // Sort by date
    // TODO: Implement proper date parsing helper if needed, assuming ISO strings for now or standard format
    // For mock data we use simple string comparison if ISO

    if (meterReadings.length < 2) return 0;

    // For now returning mock diff
    // In real implementation: sort, take last - first
    return 500; // Mock consumption
};


export async function generateHeatingBillPDF(heatingBillId: string, localId?: string): Promise<GenerateHeatingBillResult> {
    const user = await getAuthenticatedServerUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    // Fetch full user profile from DB to satisfy CalculatedBillData.user type
    const dbUser = await database.query.users.findFirst({
        where: eq(users.id, user.id)
    });

    if (!dbUser) {
        return { success: false, error: "User profile not found" };
    }

    try {
        // 1. Fetch Main Document
        const mainDoc = await database.query.heating_bill_documents.findFirst({
            where: eq(heating_bill_documents.id, heatingBillId),
        });

        if (!mainDoc) {
            return { success: false, error: "Heating bill document not found" };
        }

        if (!mainDoc.objekt_id || !mainDoc.start_date || !mainDoc.end_date) {
            return { success: false, error: "Heating bill document missing required fields (objekt_id, start_date, end_date)" };
        }

        // 2. Fetch Building (Objekt)
        const objekt = await database.query.objekte.findFirst({
            where: eq(objekte.id, mainDoc.objekt_id),
        });

        if (!objekt) {
            return { success: false, error: "Building (Objekt) not found" };
        }

        // 3. Fetch Units (Locals) - Fetch ALL for building calculations
        const allLocals = await database.query.locals.findMany({
            where: eq(locals.objekt_id, mainDoc.objekt_id),
            with: {
                local_meters: true
            }
        });

        // Calculate Total Living Space
        const totalLivingSpace = allLocals.reduce((sum, local) => sum + Number(local.living_space || 0), 0);

        // 4. Fetch Meters & Readings
        // Collect all meter IDs in the building
        const allMeterIds = allLocals.flatMap(local => local.local_meters.map(m => m.id)).filter(id => id && id !== "");

        // Safely handle dates which might be strings or Date objects depending on driver
        const startDateObj = new Date(mainDoc.start_date);
        const endDateObj = new Date(mainDoc.end_date);
        const startDate = startDateObj.toISOString();
        const endDate = endDateObj.toISOString();

        // Calculate adjusted start date (7 days prior) for baseline reading search
        const adjustedStartDate = new Date(startDateObj);
        adjustedStartDate.setDate(adjustedStartDate.getDate() - 7);
        const adjustedStartStr = adjustedStartDate.toISOString().split('T')[0];

        let readings: MeterReadingType[] = [];

        // RPC Call
        const supabase = await supabaseServer();
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_dashboard_data', {
            p_local_meter_ids: allMeterIds,
            p_device_types: [
                'Heat', 'Water', 'WWater', 'Elec',
                'Stromzähler', 'Kaltwasserzähler', 'Warmwasserzähler',
                'WMZ Rücklauf', 'Heizkostenverteiler', 'Wärmemengenzähler'
            ],
            p_start_date: adjustedStartStr,
            p_end_date: endDate
        });

        if (rpcError) {
            console.error("RPC Error fetching dashboard data:", rpcError);
            // Fallback or just log, depending on strictness. 
            // For now, we will proceed to check for mock override.
        } else if (rpcData) {
            // Transform RPC data to MeterReadingType
            readings = rpcData.map((record: any) => {
                const parsedDataJson = record.parsed_data || {};
                return {
                    'Frame Type': record.frame_type || parsedDataJson['Frame Type'] || '',
                    'Manufacturer': record.manufacturer || parsedDataJson['Manufacturer'] || '',
                    'ID': record.device_id,
                    'Version': record.version || parsedDataJson['Version'] || '',
                    'Device Type': record.device_type,
                    'TPL-Config': parsedDataJson['TPL-Config'] || '',
                    'Access Number': record.access_number || parsedDataJson['Access Number'] || 0,
                    'Status': record.status || parsedDataJson['Status'] || '',
                    'Encryption': record.encryption || parsedDataJson['Encryption'] || 0,
                    ...parsedDataJson
                } as MeterReadingType;
            });
        }

        // TEMPORARY: FORCE MOCK DATA OVERRIDE
        // Uncomment this logic to force mock data when live data is missing or for testing
        const USE_MOCK_DATA = true; // Flag to toggle mock data
        if (USE_MOCK_DATA || readings.length === 0) {
            console.warn("USING MOCK DATA FOR HEATING BILL GENERATION");
            readings = getMockReadings(allMeterIds, startDate, endDate);
        }


        // 5. Fetch Invoices
        const invoices = await database.query.invoice_documents.findMany({
            where: and(
                eq(invoice_documents.objekt_id, mainDoc.objekt_id),
                // Add date filtering logic here if invoices should be strictly within period
                // For now assuming all invoices linked to the building are relevant or filtered by UI selection
                // Optimally we should link invoices to the heating bill explicitly if possible, 
                // or filter by date range overlap
            )
        });

        // 6. Fetch Contracts & Tenants
        // We need contracts for the specific unit we are generating the bill for.

        // Determine Target Local 
        const targetLocalId = localId || mainDoc.local_id;

        if (!targetLocalId) {
            return { success: false, error: "No local/unit specified for generation" };
        }

        const targetLocal = allLocals.find(l => l.id === targetLocalId);
        if (!targetLocal) {
            return { success: false, error: "Target local unit not found in building" };
        }

        const localContracts = await database.query.contracts.findMany({
            where: eq(contracts.local_id, targetLocalId),
            with: {
                contractors: true
            }
        });

        // --- CALCULATIONS START HERE (Phase 2) ---

        // 1. Group Invoices by Cost Category
        const invoicesByType = groupInvoicesByType(invoices);

        // 2. Calculate Building Totals (Consumption & Costs)
        // TODO: Iterate over all meters in building (allLocals) and sum consumption
        const totalBuildingConsumption: Record<string, number> = {
            'Heat': 50000,   // Mock Total
            'Water': 10000,  // Mock Total
            'WWater': 5000   // Mock Hot Water Total
        };

        // 3. Unit Cost Distribution
        // For the target unit (mainDoc.local_id)
        const unitCostDistribution = [];

        // Example Calculation for Heating
        // Fixed Share 30%, Variable 70%
        const totalHeatingCost = (invoicesByType['Heating'] || []).reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);
        const heatingFixedShare = totalHeatingCost * 0.30;
        const heatingVariableShare = totalHeatingCost * 0.70;

        // Unit Share
        const unitArea = Number(targetLocal.living_space || 0);
        const unitFixedCost = (unitArea / totalLivingSpace) * heatingFixedShare;

        // Unit Consumption specific to this unit's meters
        const unitMeters = targetLocal.local_meters;
        let unitHeatConsumption = 0;
        unitMeters.forEach(m => {
            // if meter type is Heat...
            unitHeatConsumption += calculateConsumption(readings, m.id, startDate, endDate);
        });

        const unitVariableCost = (unitHeatConsumption / totalBuildingConsumption['Heat']) * heatingVariableShare;

        unitCostDistribution.push({
            category: 'Heating',
            fixedCost: unitFixedCost,
            variableCost: unitVariableCost,
            total: unitFixedCost + unitVariableCost
        });

        // Prepare Logo Path
        const logoPath = path.resolve(process.cwd(), 'public/admin_logo.png');
        const logoExists = fs.existsSync(logoPath);

        const calculatedData: CalculatedBillData = {
            mainDoc,
            objekt,
            local: targetLocal,
            user: dbUser, // Use the fully fetched DB user
            contracts: localContracts,
            invoices,
            costCategories: [], // Fetch these if needed
            readings,
            totalLivingSpace,
            totalBuildingConsumption,
            unitCostDistribution,
            logoPath: logoExists ? logoPath : undefined
        };

        console.log("Calculated Data:", JSON.stringify(calculatedData, null, 2));


        // --- PDF GENERATION (Phase 3) ---
        // Using renderToStream from @react-pdf/renderer
        const stream = await renderToStream(<HeidiSystemsPdf data={calculatedData} /> as any);

        // --- STORAGE (Phase 3) ---
        // Use 'documents' bucket as per user feedback and working example
        const fileName = `Heizkostenabrechnung_${targetLocalId}_${Date.now()}.pdf`;
        const storagePath = `${user.id}/${fileName}`; // Folder structure: userId/filename

        const chunks: Uint8Array[] = [];
        for await (const chunk of stream) {
            chunks.push(chunk as Uint8Array);
        }
        const buffer = Buffer.concat(chunks);

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(storagePath, buffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (uploadError) {
            console.error("Supabase Upload Error:", uploadError);
            return { success: false, error: "Failed to upload PDF: " + uploadError.message };
        }

        // Insert into documents table
        const [documentRecord] = await database
            .insert(documents)
            .values({
                document_name: fileName,
                document_url: storagePath,
                related_id: heatingBillId,
                related_type: "heating_bill",
                user_id: user.id,
            })
            .returning();

        console.log("Document record created:", documentRecord.id);

        // Get signed URL
        const { data: urlData, error: urlError } = await supabase.storage
            .from('documents')
            .createSignedUrl(storagePath, 60 * 60); // 1 hour expiry

        if (urlError) {
            console.error("Supabase Signed URL Error:", urlError);
            return { success: false, error: "Failed to create signed URL: " + urlError.message };
        }

        return { success: true, url: urlData.signedUrl };

    } catch (error) {
        console.error("Error generating heating bill PDF:", error);
        return { success: false, error: "Internal server error: " + (error as Error).message };
    }
}
