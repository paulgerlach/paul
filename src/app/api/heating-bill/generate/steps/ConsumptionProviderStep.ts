import { BaseStep } from "./BaseStep";
import { HeatingBillContext } from "../context/HeatingBillContext";

export class ConsumptionProviderStep extends BaseStep {
    async execute(context: HeatingBillContext): Promise<void> {
        // Mock consumption data behavior preserved as default
        const mockConsumptionData = {
            heat: {
                consumption: 1000,
                startValue: 1000,
                endValue: 2000,
                unit: "kWh",
            },
            hotWater: {
                consumption: 1000,
                startValue: 1000,
                endValue: 2000,
                unit: "m³",
            },
            coldWater: {
                consumption: 1000,
                startValue: 1000,
                endValue: 2000,
                unit: "m³",
            },
        };

        context.consumptionData = mockConsumptionData;
    }
}
