import { MeterReadingType } from "@/api";
import { DateRange, parseGermanNumber } from "./heatingCostServices";
import { monthNames } from "@/lib/constants/date";

export const getHCADailyConsumption = (
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

export function extractMonthlyHCAValues(currentReading: Record<string, any>): Map<string, number> {
  const monthlyValues = new Map<string, number>();

  // Get the reading date to determine month offsets
  const readingDate = new Date(currentReading.readingDate);
  const currentYear = readingDate.getFullYear();
  const currentMonth = readingDate.getMonth(); // 0-indexed

  // Extract all IV,n values (n = 0 to 27)
  for (let i = 0; i <= 27; i++) {
    const key = `IV,${i},0,0,,Units HCA`;
    const value = currentReading[key];

    if (value !== undefined && value !== null && typeof value === 'number') {
      // Calculate the month for this historical value
      // i=0 is current, i=1 is previous month, etc.
      const monthOffset = i;
      const targetMonth = currentMonth - monthOffset;

      let year = currentYear;
      let month = targetMonth;

      // Handle year rollover for negative month offsets
      while (month < 0) {
        month += 12;
        year -= 1;
      }

      const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
      monthlyValues.set(monthStr, value);
    }
  }

  return monthlyValues;
}

export function addHCAMonthlyTotals(
  currentReading: Record<string, any>,
  monthlyTotals: Map<string, number>
): void {
  const monthlyValues = extractMonthlyHCAValues(currentReading);

  const sortedMonths = Array.from(monthlyValues.keys()).sort();

  for (let i = 1; i < sortedMonths.length; i++) {
    const currentMonth = sortedMonths[i];
    const previousMonth = sortedMonths[i - 1];

    const currentValue = monthlyValues.get(currentMonth) || 0;
    const previousValue = monthlyValues.get(previousMonth) || 0;

    const delta = currentValue - previousValue;

    if (delta > 0 && !monthlyTotals.has(previousMonth)) {
  monthlyTotals.set(previousMonth, delta);
}
  }
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