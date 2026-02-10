export const generateHotWaterAllocation = (
    hotWaterConsumption: number,
    totalGasConsumption: number,
    totalGasCost: number,
) => {
    const metersRentingCost = 100;
    // Formula as-is from original code
    const consumption = (2.5 * hotWaterConsumption * (60 - 10)) / 1.5;

    const percentageOfGas = consumption / totalGasConsumption;

    const heatingCost = percentageOfGas * totalGasCost;

    return {
        consumptionAllocation: {
            consumption: consumption.toLocaleString("de-DE"),
            percentageOfGas: percentageOfGas.toLocaleString("de-DE"),
        },
        costAllocation: {
            cost: heatingCost,
            metersRentingCost,
        },
    };
};
