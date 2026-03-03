import { MeterReadingType } from "@/api";
import { parseGermanNumber } from "./heatingCostServices";

export const getStandardMeterConsumption = (reading: MeterReadingType, readingDate:Date, startDate: Date, endDate: Date) => {
  
  let monthlyConsumption = new Map<number, number>();
  // Standard meters: Calculate deltas from cumulative IV values
  // Only include IV values whose months fall within the date range
  const rangeStart = startDate ? new Date(startDate) : null;
  const rangeEnd = endDate ? new Date(endDate) : null;

  const getIVValue = (ivKey: string, offset: number): number | null => {
    const value = parseGermanNumber(reading[ivKey as keyof MeterReadingType]);
    if (value === null || value <= 0) return null;

    // Calculate the month this IV value represents
    const ivMonthDate = new Date(readingDate);
    ivMonthDate.setMonth(readingDate.getMonth() - offset);
    ivMonthDate.setDate(1);

    // Only include if within date range
    if (rangeStart && rangeEnd) {
      if (ivMonthDate < rangeStart || ivMonthDate > rangeEnd) {
        return null;
      }
    }

    return value;
  };

  const iv0 = getIVValue("IV,0,0,0,Wh,E", 0);
  const iv1 = getIVValue("IV,1,0,0,Wh,E", 1);
  const iv2 = getIVValue("IV,2,0,0,Wh,E", 2);
  const iv3 = getIVValue("IV,3,0,0,Wh,E", 3);
  const iv5 = getIVValue("IV,5,0,0,Wh,E", 5);

  const cumulativeValues: { value: number; offset: number }[] = [];
  if (iv0 !== null) cumulativeValues.push({ value: iv0, offset: 0 });
  if (iv1 !== null) cumulativeValues.push({ value: iv1, offset: 1 });
  if (iv2 !== null) cumulativeValues.push({ value: iv2, offset: 2 });
  if (iv3 !== null) cumulativeValues.push({ value: iv3, offset: 3 });
  if (iv5 !== null) cumulativeValues.push({ value: iv5, offset: 5 });

  // Sort by offset (most recent first)
  cumulativeValues.sort((a, b) => a.offset - b.offset);

  // Calculate consumption for each month (delta between consecutive values)
  for (let i = 0; i < cumulativeValues.length - 1; i++) {
    const consumption = cumulativeValues[i].value - cumulativeValues[i + 1].value;
    if (consumption >= 0) {
      monthlyConsumption.set(cumulativeValues[i].offset, (monthlyConsumption.get(cumulativeValues[i].offset) || 0) + consumption);
    }
  }

  return monthlyConsumption;
}