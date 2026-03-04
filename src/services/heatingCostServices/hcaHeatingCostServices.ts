import { MeterReadingType } from "@/api";
import { DateRange, parseGermanNumber } from "./heatingCostServices";
import { monthNames } from "@/lib/constants/date";

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


export const getHCADisplayMapping = (
  monthlyConsumption: Map<string, number>, // key = "YYYY-MM"
  referenceDate: number,
  monthsToShow: number
): { label: string; value: number }[] => {
  const result: { label: string; value: number }[] = [];
  const refDate = new Date(referenceDate);

  for (let offset = monthsToShow; offset >= 0; offset--) {
    const monthDate = new Date(refDate.getFullYear(), refDate.getMonth() - offset, 1);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    const consumption = monthlyConsumption.get(key) ?? 0;

    result.push({
      label: `${monthNames[month]} ${year}`,
      value: Math.round(consumption),
    });
  }

  return result;
};