import { GroupedHeatingInvoices } from "@/api";

/**
 * Data shape returned by getHeatBillingGeneralInfo
 */
export type HeatBillingGeneralInfo = {
    billingStartDate: Date | string | null;
    billingEndDate: Date | string | null;
    street: string | null;
    zip: string | null;
    consumptionDependent: boolean | string | null;
    livingSpaceShare: number | string | null;
    ownerFirstName: string | null;
    ownerLastName: string | null;
    documentCreationDate: Date | string;
    totalLivingSpace: number;
    apartmentCount: number;
} | undefined;

/**
 * Request payload for the generation endpoint
 */
export interface GenerateHeatingBillRequest {
    documentId: string;
    objektId: string;
    apartmentId: string;
}

/**
 * Response shape for the generation endpoint
 * Preserving the exact structure of current route response.
 */
export interface HeatingBillResponseDTO {
    documentId: string;
    documentPath: string;
    publicUrl: string;
    fileName: string;
    billingInvoices: GroupedHeatingInvoices;
    consumptionData: ConsumptionData;
}

export interface ConsumptionData {
    heat: ConsumptionItem;
    hotWater: ConsumptionItem;
    coldWater: ConsumptionItem;
}

export interface ConsumptionItem {
    consumption: number;
    startValue: number;
    endValue: number;
    unit: string;
}

export interface AllocationResult {
    consumptionAllocation: {
        consumption: string;
        percentageOfGas: string;
    };
    costAllocation: {
        cost: number;
        metersRentingCost: number;
    };
}

export interface InvoiceTotals {
    energyAndOperatingTotal: number;
}
