
import type {
    ContractorType,
    ContractType,
    DocCostCategoryType,
    HeatingBillDocumentType,
    InvoiceDocumentType,
    LocalType,
    ObjektType,
    UserType,
} from "@/types";
import type { MeterReadingType } from "@/api";
import type { ConsumptionData, MeterDetail } from "@/hooks/useConsumptionData";

export type HeatingBillPreviewProps = {
    mainDoc: HeatingBillDocumentType;
    local: LocalType;
    totalLivingSpace: number;
    contracts: (ContractType & { contractors: ContractorType[] })[];
    costCategories: DocCostCategoryType[];
    invoices: InvoiceDocumentType[];
    objekt: ObjektType;
    user: UserType;
};

export type HeatingBillPreviewData = {
    mainDocDates: {
        created_at?: string;
        start_date?: string | null;
        end_date?: string | null;
    };
    mainDocData: HeatingBillDocumentType;
    userInfo: {
        first_name: string;
        last_name: string;
    };
    objektInfo: {
        zip: string;
        street: string;
    };
    contractorsNames: string;
    totalInvoicesAmount: number;
    totalDiff: number;
    totalLivingSpace: number;
    contracts: (ContractType & { contractors: ContractorType[] })[];
    invoices: InvoiceDocumentType[];
    costCategories: DocCostCategoryType[];
    propertyNumber: string;
    heidiCustomerNumber: string;
    localId?: string;
    unitArea: number;
    // Meter reading data
    coldWaterData?: MeterReadingType[];
    hotWaterData?: MeterReadingType[];
    heatingData?: MeterReadingType[];
    consumption?: ConsumptionData;
    meters?: MeterDetail[];
};
