import { MeterReadingType } from "@/api";
import { DateRange, parseGermanNumber } from "./heatingCostServices";

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

const getHCADailyConsumption = (reading: MeterReadingType, readingDate: Date, dateRange: DateRange): Map<number, number> => {
  let dailyConsumption = new Map<number, number>();
  return dailyConsumption
}