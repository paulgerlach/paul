import { BaseStep } from "./BaseStep";
import { HeatingBillContext } from "../context/HeatingBillContext";
import {
    getContractsWithContractorsByLocalID,
    getHeatBillingGeneralInfo,
    getHeatingBillInvoices,
} from "@/api";

export class DomainDataLoaderStep extends BaseStep {
    async execute(context: HeatingBillContext): Promise<void> {
        const [contractsWithContractors, generalInfo, billingInvoices] =
            await Promise.all([
                getContractsWithContractorsByLocalID(context.apartmentId),
                getHeatBillingGeneralInfo(context.documentId),
                getHeatingBillInvoices(context.documentId, context.objektId),
            ]);

        // Validate required data exists (Behavior preservation)
        if (!generalInfo) {
            // Throwing an error here that the manager will catch and turn into a 404
            const error = new Error("Dokument nicht gefunden");
            (error as any).code = "DOCUMENT_NOT_FOUND";
            (error as any).statusCode = 404;
            throw error;
        }

        context.generalInfo = generalInfo;
        context.contracts = contractsWithContractors;
        context.billingInvoices = billingInvoices;
    }
}
