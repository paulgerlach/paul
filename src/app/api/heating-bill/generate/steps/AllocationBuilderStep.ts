import { BaseStep } from "./BaseStep";
import { HeatingBillContext } from "../context/HeatingBillContext";
import { generateHotWaterAllocation } from "../services/AllocationService";

export class AllocationBuilderStep extends BaseStep {
    async execute(context: HeatingBillContext): Promise<void> {
        if (!context.consumptionData) {
            throw new Error("Consumption data not available");
        }

        context.hotWaterHeatingAllocation = generateHotWaterAllocation(
            context.consumptionData.hotWater.consumption,
            2000, // Hardcoded in original
            context.invoiceTotals.energyAndOperatingTotal,
        );
    }
}
