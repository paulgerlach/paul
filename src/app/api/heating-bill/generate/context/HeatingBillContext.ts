import {
    GenerateHeatingBillRequest,
    HeatBillingGeneralInfo,
    ConsumptionData,
    AllocationResult,
    InvoiceTotals,
    HeatingBillResponseDTO,
} from "../types";
import { GroupedHeatingInvoices } from "@/api";
import { ContractType, ContractorType } from "@/types";
import { User } from "@supabase/supabase-js";

export class HeatingBillContext {
    // Identifiers
    public userId: string;
    public documentId: string;
    public objektId: string;
    public apartmentId: string;

    // Fetched Data
    public user: User;
    public generalInfo: HeatBillingGeneralInfo;
    public billingInvoices: GroupedHeatingInvoices | undefined;
    public contracts: (ContractType & { contractors: ContractorType[] })[] = [];

    // Computed Intermediates
    public invoiceTotals: InvoiceTotals = { energyAndOperatingTotal: 0 };
    public consumptionData: ConsumptionData | undefined;
    public hotWaterHeatingAllocation: AllocationResult | undefined;
    public logoSrc: string | undefined;

    // PDF Artifacts
    public pdfProps: any; // Using any to match the flexibility of the props passed to the component, but we could type this strictly if we had the component props type
    public pdfBuffer: Buffer | undefined;

    // Storage Artifacts
    public fileName: string | undefined;
    public storagePath: string | undefined;
    public documentRecord: any; // Drizzle result type
    public signedUrl: string | undefined;

    constructor(user: User, request: GenerateHeatingBillRequest) {
        this.user = user;
        this.userId = user.id;
        this.documentId = request.documentId;
        this.objektId = request.objektId;
        this.apartmentId = request.apartmentId;
    }

    public toResponse(): HeatingBillResponseDTO {
        if (
            !this.documentRecord ||
            !this.storagePath ||
            !this.signedUrl ||
            !this.fileName ||
            !this.billingInvoices ||
            !this.consumptionData
        ) {
            throw new Error("Cannot build response: Missing required context data.");
        }

        return {
            documentId: this.documentRecord.id,
            documentPath: this.storagePath,
            publicUrl: this.signedUrl,
            fileName: this.fileName,
            billingInvoices: this.billingInvoices,
            consumptionData: this.consumptionData,
        };
    }
}
