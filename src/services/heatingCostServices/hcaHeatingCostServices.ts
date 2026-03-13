import { MeterReadingType } from "@/api";
import {parseGermanNumber } from "./heatingCostServices";

export const getHCAMonthlyConsumption = (
  currentReading: MeterReadingType,
  previousReading: MeterReadingType | null,
): number => {

  const currentCumulative = parseGermanNumber(
    currentReading[`IV,0,0,0,,Units HCA` as keyof MeterReadingType]
  );

  const previousCumulative = previousReading ? parseGermanNumber(
    previousReading[`IV,0,0,0,,Units HCA` as keyof MeterReadingType]
  ) : 0;
  if (!currentCumulative)
    return 0;
  return currentCumulative - (previousCumulative ?? 0);;
}
