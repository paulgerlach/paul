import { MeterReadingType } from "@/api";
import { DateRange, parseGermanNumber } from "./heatingCostServices";

export const getHCAMonthlyConsumption = (
  currentReading: MeterReadingType,
  currentReadingDate: Date,
  previousReading: MeterReadingType | null,
  previousReadingDate: Date | null,
  dateRange: DateRange,
  monthsToShow: number
): Map<number, number> => {
  let monthlyConsumption = new Map<number, number>();
  for (let offset = 0; offset < monthsToShow; offset++) {
    const currentCumulative = parseGermanNumber(
      currentReading[`IV,${offset},0,0,,Units HCA` as keyof MeterReadingType]
    );

    const previousCumulative = previousReading ? parseGermanNumber(
      previousReading[`IV,${offset + 1},0,0,,Units HCA` as keyof MeterReadingType]
    ) : 0;

    const ivMonthDate = new Date(currentReadingDate);
    ivMonthDate.setMonth(currentReadingDate.getMonth() - offset);
    ivMonthDate.setDate(1);

    let isInRange = true;
    if (dateRange.startDate && dateRange.endDate) {
      isInRange = ivMonthDate >= dateRange.startDate && ivMonthDate <= dateRange.endDate;
    }

    if (currentCumulative !== null && previousCumulative !== null && isInRange) {
      monthlyConsumption.set(offset, currentCumulative - previousCumulative);
    }
  }

  return monthlyConsumption;
}

const getHCADailyConsumption = (reading: MeterReadingType, readingDate: Date, dateRange: DateRange): Map<number, number> => {
  let dailyConsumption = new Map<number, number>();
  return dailyConsumption
}