import { MeterReadingType } from "@/api";
import { monthNames } from "@/lib/constants/date";
import { getDateString, getReadingDate, isDateRangeLongerThanAMonth } from "@/utils/date";

export const aggregateDataByTimeRange = (
  readings: MeterReadingType[],
  startDate?: Date | null,
  endDate?: Date | null
): { label: string; value: number }[] => {
  if (!readings || readings.length === 0 || !startDate || !endDate) return [];

  // Filter out invalid readings first
  let validReadings = readings.filter((reading: MeterReadingType) => isValidReading(reading, startDate, endDate));
  if (validReadings.length === 0) return [];

  // Determine date range for display
  const now = endDate ? new Date(endDate) : new Date();
  const monthsToShow = getMonthsToShow(startDate, endDate, now);

  const deviceReadings = getLatestDeviceReadingsMonthly(validReadings);

  let monthlyConsumption = new Map<number, number>();
  const referenceDate = deviceReadings.size > 0
    ? Math.max(...Array.from(deviceReadings.values()).map(r => r.date.getTime()))
    : now.getTime();
  
  deviceReadings.forEach(({ reading, date: readingDate, previousReading, previousDate }) => {
    const deviceType = validReadings[0]?.["Device Type"];
    const isHCA = deviceType === "HCA";

    if (isHCA) {
      // isDateRangeLongerThanAMonth(startDate, endDate) ?
      monthlyConsumption = getHCAMonthlyConsumption(reading, readingDate, previousReading, previousDate, { startDate, endDate }, monthsToShow);
        // dailyConsumption = getHCADailyConsumption(reading, readingDate, { startDate, endDate });
    } else {
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
    }
  });

  // STEP 3: Convert month offsets to actual labels
  const result: { label: string; value: number }[] = [];

  // Get the most recent reading date to use as reference for month labels
  
  const refDate = new Date(referenceDate);

  for (let offset = 0; offset < monthsToShow && offset < 4; offset++) {
    const consumption = monthlyConsumption.get(offset) || 0;
    if (consumption > 0 || offset < 2) {
      const monthDate = new Date(refDate.getFullYear(), refDate.getMonth() - offset, 1);
      result.push({
        label: monthNames[monthDate.getMonth()],
        value: Math.round(consumption),
      });
    }
  }

  return result.reverse();
};

const isValidReading = (reading: MeterReadingType, startDate: Date, endDate: Date): boolean => {
  return hasValidStatus(reading.Status)
    && hasNoErrorFlags(reading["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"])
    && hasValidEnergyReading(reading)
    && hasValidVolumeReading(reading)
    && isWithinDateRange(reading, startDate, endDate);
};

// Helper to parse German number format
const parseGermanNumber = (value: string | number | undefined): number | null => {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number") return value;
  const str = String(value).trim();
  if (str === "") return null;
  const normalized = str.replace(/\./g, "").replace(/,/g, ".");
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
};


const getRecentReadingDate = (readings: MeterReadingType[]): Date | null => {
  if (!readings || readings.length === 0) return null;
  
  // Support both OLD format (IV,0,0,0,,Date/Time) and NEW format (Actual Date / Raw Date)
  const oldFormatDate = readings[0]["IV,0,0,0,,Date/Time"];
  const newActualDate = readings[0]["Actual Date"];
  const newRawDate = readings[0]["Raw Date"];
  
  let dateString: string | null = null;
  
  if (oldFormatDate && typeof oldFormatDate === "string") {
    dateString = oldFormatDate.split(" ")[0];
  } else if (newActualDate && typeof newActualDate === "string") {
    dateString = newActualDate.split(" ")[0];
  } else if (newRawDate && typeof newRawDate === "string") {
    // Convert "29-10-2025" to "29.10.2025"
    dateString = newRawDate.replace(/-/g, ".");
  }
  
  if (!dateString) return null;
  const [day, month, year] = dateString.split(".").map(Number);
  return new Date(year, month - 1, day);
};

// Helper function to get unique dates from readings
const getUniqueDatesFromReadings = (readings: MeterReadingType[]): Date[] => {
  const uniqueDates = new Set<string>();
  const dates: Date[] = [];

  readings.forEach((reading) => {
    // Support both OLD format (IV,0,0,0,,Date/Time) and NEW format (Actual Date / Raw Date)
    const oldFormatDate = reading["IV,0,0,0,,Date/Time"];
    const newActualDate = reading["Actual Date"];
    const newRawDate = reading["Raw Date"];
    
    let dateString: string | null = null;
    
    if (oldFormatDate && typeof oldFormatDate === "string") {
      dateString = oldFormatDate.split(" ")[0];
    } else if (newActualDate && typeof newActualDate === "string") {
      dateString = newActualDate.split(" ")[0];
    } else if (newRawDate && typeof newRawDate === "string") {
      dateString = newRawDate.replace(/-/g, ".");
    }
    
    if (dateString && !uniqueDates.has(dateString)) {
      uniqueDates.add(dateString);
      const [day, month, year] = dateString.split(".").map(Number);
      dates.push(new Date(year, month - 1, day));
    }
  });

  return dates.sort((a, b) => a.getTime() - b.getTime());
};

// Helper function that returns an array with both date and value for monthly historical data
const getMonthlyEnergyDataWithDates = (
  readings: MeterReadingType[]
): { date: Date; value: number }[] => {
  const monthlyData: { date: Date; value: number }[] = [];
  const mostRecentDate = getRecentReadingDate(readings);
  if (!mostRecentDate) return [];

  for (let i = 0; i <= 30; i += 2) {
    const key = `IV,${i},0,0,Wh,E` as keyof MeterReadingType;
    const historicalDate = new Date(mostRecentDate);
    historicalDate.setMonth(mostRecentDate.getMonth() - i / 2);

    let totalValue = 0;
    readings.forEach((reading) => {
      const value = reading[key];
      if (typeof value === "string") {
        totalValue += parseFloat(value.replace(",", ".") || "0");
      } else if (typeof value === "number") {
        totalValue += value;
      }
    });

    monthlyData.unshift({ date: historicalDate, value: totalValue });
  }

  return monthlyData;
};

const hasValidStatus = (status: string): boolean => {
  return status === "00h"; // Status other than 00h indicates error
};

const hasNoErrorFlags = (errorFlags: string | undefined): boolean => {
  return !errorFlags || errorFlags === "0b"; // Non-zero error flags indicate problems
};

const hasValidEnergyReading = (reading: MeterReadingType): boolean => {

  // Check for obvious error values in energy reading
  // Support both OLD format (IV,0,0,0,Wh,E) and NEW format (Actual Energy / HCA)
  const oldFormatEnergy = reading["IV,0,0,0,Wh,E"];
  const newFormatEnergy = reading["Actual Energy / HCA"];
  const currentValue = newFormatEnergy !== undefined ? newFormatEnergy : oldFormatEnergy;

  let numValue = 0;
  if (currentValue != null) {
    numValue =
      typeof currentValue === "number"
        ? currentValue
        : parseFloat(String(currentValue).replace(",", ".") || "0");
  }
  return numValue < 10000000
}

const hasValidVolumeReading = (reading: MeterReadingType): boolean => {
  // Check for error patterns in volume
  // Support both OLD format (IV,0,0,0,m^3,Vol) and NEW format (Actual Volume)
  const oldFormatVolume = reading["IV,0,0,0,m^3,Vol"];
  const newFormatVolume = reading["Actual Volume"];
  const volume = newFormatVolume !== undefined ? newFormatVolume : oldFormatVolume;

  let volumeValue = 0;
  if (volume != null) {
    volumeValue =
      typeof volume === "number"
        ? volume
        : parseFloat(String(volume).replace(",", ".") || "0");
  }
  // Filter out obvious volume error codes (777.777, 888.888, 999.999)
  return volumeValue < 777 &&
    (Math.abs(volumeValue - 777.777) >= 0.001 ||
      Math.abs(volumeValue - 888.888) >= 0.001 ||
      Math.abs(volumeValue - 999.999) >= 0.001)

}

const isWithinDateRange = (reading: MeterReadingType, startDate: Date, endDate: Date): boolean => {
  const rangeStart = new Date(startDate);
  const rangeEnd = new Date(endDate);

  let dateString: string | null = null;

  const oldFormatDate = reading["IV,0,0,0,,Date/Time"];
  const newActualDate = reading["Actual Date"];
  const newRawDate = reading["Raw Date"];

  if (oldFormatDate && typeof oldFormatDate === "string") {
    dateString = oldFormatDate.split(" ")[0];
  } else if (newActualDate && typeof newActualDate === "string") {
    dateString = newActualDate.split(" ")[0];
  } else if (newRawDate && typeof newRawDate === "string") {
    dateString = newRawDate.replace(/-/g, ".");
  }

  if (!dateString) return false;

  const [day, month, year] = dateString.split(".").map(Number);
  const fullYear = year < 100 ? 2000 + year : year;
  const readingDate = new Date(fullYear, month - 1, day);
  return readingDate >= rangeStart && readingDate <= rangeEnd;
}

const parseHCADate = (dateStr: string | undefined): Date => {
  if (!dateStr) return new Date(0);
  const [day, month, year] = dateStr.split(".").map(Number);
  return new Date(year, month - 1, day);
};

const getMonthsToShow = (startDate: Date, endDate: Date, now:Date) => {
  const rangeStart = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const daysDiff = Math.ceil((now.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(2, Math.ceil(daysDiff / 30));
}

const getLatestDeviceReadingsDaily = (
  validReadings: MeterReadingType[]
): Map<string, { reading: MeterReadingType; date: Date; previousReading: MeterReadingType | null; previousDate: Date | null }> => {

  const deviceLatestReadings = new Map<string, {
    reading: MeterReadingType;
    date: Date;
    previousReading: MeterReadingType | null;
    previousDate: Date | null
  }>();

  validReadings.forEach((reading) => {
    const deviceId = String(reading.ID || reading["Number Meter"] || "unknown");
    const dateString = getDateString(reading["IV,0,0,0,,Date/Time"], reading["Actual Date"], reading["Raw Date"]);
    const readingDate = getReadingDate(dateString);

    const existing = deviceLatestReadings.get(deviceId);

    if (!existing) {
      // First reading for this device — no previous yet
      deviceLatestReadings.set(deviceId, {
        reading,
        date: readingDate,
        previousReading: null,
        previousDate: null
      });
    } else if (readingDate > existing.date) {
      // New reading is latest — demote existing latest to previous
      deviceLatestReadings.set(deviceId, {
        reading,
        date: readingDate,
        previousReading: existing.reading,
        previousDate: existing.date,
      });
    } else {
      // New reading is older — check if it's a better previous candidate
      if (!existing.previousDate || readingDate > existing.previousDate) {
        deviceLatestReadings.set(deviceId, {
          ...existing,
          previousReading: reading,
          previousDate: readingDate,
        });
      }
    }
  });

  return deviceLatestReadings;
};

const getLatestDeviceReadingsMonthly = (
  validReadings: MeterReadingType[]
): Map<string, { reading: MeterReadingType; date: Date; previousReading: MeterReadingType | null; previousDate: Date | null }> => {

  const deviceLatestReadings = new Map<string, {
    reading: MeterReadingType;
    date: Date;
    previousReading: MeterReadingType | null;
    previousDate: Date | null
  }>();

  validReadings.forEach((reading) => {
    const deviceId = String(reading.ID || reading["Number Meter"] || "unknown");
    const dateString = getDateString(reading["IV,0,0,0,,Date/Time"], reading["Actual Date"], reading["Raw Date"]);
    const readingDate = getReadingDate(dateString);

    const existing = deviceLatestReadings.get(deviceId);

    if (!existing) {
      deviceLatestReadings.set(deviceId, {
        reading,
        date: readingDate,
        previousReading: null,
        previousDate: null
      });
    } else if (readingDate > existing.date) {
      // New reading becomes latest — re-evaluate old latest as previous candidate
      const previousMonthOfNew = new Date(readingDate.getFullYear(), readingDate.getMonth() - 1, 1);
      const isPrevInPreviousMonth =
        existing.date.getFullYear() === previousMonthOfNew.getFullYear() &&
        existing.date.getMonth() === previousMonthOfNew.getMonth();

      deviceLatestReadings.set(deviceId, {
        reading,
        date: readingDate,
        // Only carry forward old latest as previous if it's from the previous calendar month
        previousReading: isPrevInPreviousMonth ? existing.reading : existing.previousReading,
        previousDate: isPrevInPreviousMonth ? existing.date : existing.previousDate,
      });
    } else {
      // This reading is older — check if it belongs to the previous calendar month of the latest
      const previousMonthOfExisting = new Date(existing.date.getFullYear(), existing.date.getMonth() - 1, 1);
      const isInPreviousMonth =
        readingDate.getFullYear() === previousMonthOfExisting.getFullYear() &&
        readingDate.getMonth() === previousMonthOfExisting.getMonth();

      if (isInPreviousMonth) {
        // Among all readings from the previous month, keep the latest one
        if (!existing.previousDate || readingDate > existing.previousDate) {
          deviceLatestReadings.set(deviceId, {
            ...existing,
            previousReading: reading,
            previousDate: readingDate,
          });
        }
      }
    }
  });

  return deviceLatestReadings;
};

interface DateRange{
  startDate: Date,
  endDate: Date
}

const getHCAMonthlyConsumption = (
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
