import path from "path";
import { BaseStep } from "./BaseStep";
import { HeatingBillContext } from "../context/HeatingBillContext";

export class PdfPropsBuilderStep extends BaseStep {
    async execute(context: HeatingBillContext): Promise<void> {
        if (
            !context.generalInfo ||
            !context.billingInvoices ||
            !context.contracts ||
            !context.consumptionData ||
            !context.hotWaterHeatingAllocation
        ) {
            throw new Error("Missing required data for PDF props");
        }

        // 7. Get logo path for PDF (Preserved)
        const logoSrc = path.join(process.cwd(), "public/admin_logo.png");
        context.logoSrc = logoSrc;

        context.pdfProps = {
            generalInfo: context.generalInfo,
            billingInvoices: context.billingInvoices,
            contracts: context.contracts,
            logoSrc,
            consumptionData: context.consumptionData,
            hotWaterHeatingAllocation: context.hotWaterHeatingAllocation,
        };
    }
}
