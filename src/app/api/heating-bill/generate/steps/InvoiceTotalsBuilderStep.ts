import { BaseStep } from "./BaseStep";
import { HeatingBillContext } from "../context/HeatingBillContext";

export class InvoiceTotalsBuilderStep extends BaseStep {
    async execute(context: HeatingBillContext): Promise<void> {
        if (!context.billingInvoices) {
            throw new Error("Billing invoices not loaded");
        }

        context.invoiceTotals.energyAndOperatingTotal =
            context.billingInvoices.fuelTotal +
            context.billingInvoices.operationalTotal;
    }
}
