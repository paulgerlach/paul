import { MeterReadingType } from "@/api";
import { getDateString, getReadingDate } from "@/utils/date";
import { getHCAMonthlyConsumption } from "./hcaHeatingCostServices";
import { parseGermanDate } from "@/utils";
import { HeatCostDisplay } from "@/types/HeatCostDisplay";

export interface DateRange {
	startDate: Date;
	endDate: Date;
}

const calculateConsumptionForReadings = (
	readings: MeterReadingType[],
): number | undefined => {
	let minVal: number | undefined;
	let maxVal: number | undefined;

	readings.forEach((reading) => {
		const currentVal = parseGermanNumber(
			reading[`IV,0,0,0,,Units HCA` as keyof MeterReadingType],
		);
		// this is horrible code, please forgive me
		// I'd rather not an On2 function, but I have no choice.
		if (currentVal !== null && currentVal !== undefined) {
			if (minVal === undefined || currentVal < minVal) {
				minVal = currentVal;
			}
			if ((maxVal === undefined || currentVal > maxVal) && currentVal < 10000) {
				maxVal = currentVal;
			}
		}
	});

	if (minVal !== undefined && maxVal !== undefined) {
		return maxVal - minVal;
	}

	return undefined;
};

export const aggregateHCADataByTimeRange = (
	readings: MeterReadingType[],
	startDate?: Date | null,
	endDate?: Date | null,
): HeatCostDisplay[] => {
	if (!readings?.length || !startDate || !endDate) return [];
	const validReadings = readings.filter(
		(reading) => isValidReading(reading, startDate, endDate), // we lose 10 items here
	);
	if (validReadings.length === 0) return [];
	//Map of meter ID and it's list of readings
	const meterReadingsGroupedById = new Map<string, MeterReadingType[]>();

	// grouping meter reading by deviceID
	validReadings.forEach((reading) => {
		const deviceId = reading.ID || reading["Number Meter"]?.toString();
		if (!deviceId) return;
		if (!meterReadingsGroupedById.has(deviceId)) {
			meterReadingsGroupedById.set(deviceId, []);
		}

    // separate the meters by deviceId into a map
		meterReadingsGroupedById.get(deviceId)!.push(reading);
	});

	const monthlyTotals = new Map<string, number>();

	//iterate through each meter Id and its readings
	meterReadingsGroupedById.forEach((meter, _) => {

		const metersSeparatedByMonthBuckets = new Map<string, MeterReadingType[]>();

    //iterate through each meter reading now we have them separated by ID
		meter.forEach((meterReading) => {
			const date = parseHCADate(meterReading);

			const dy = date?.getFullYear();
			const dm = date!.getMonth() + 1;

      // label
			const monthStr = `${dy}-${dm?.toString().padStart(2, "0")}`;

			const allReadings = metersSeparatedByMonthBuckets.get(monthStr);
			if (!allReadings) {
				metersSeparatedByMonthBuckets.set(monthStr, [meterReading]);
			} else {
				allReadings.push(meterReading);
				metersSeparatedByMonthBuckets.set(monthStr, allReadings);
			}
		});

		metersSeparatedByMonthBuckets.forEach((meterReadingMonth, monthStr) => {
			const currentDelta = calculateConsumptionForReadings(meterReadingMonth);
			monthlyTotals.set(
				monthStr,
				(monthlyTotals.get(monthStr) || 0) + (currentDelta ?? 0),
			);
		});
	});

  //tree
  // MetersReadings => a series of meters each with readings
  // Meter Reading => a series of readings for a given meter 
  // Buckets => A group of meter readings separated by yyyy-mm label


  const retArray = Array.from(monthlyTotals, ([label, value]) => ({ label, value }));
  retArray.sort((f,s) => { 
  return f.label < s.label ? -1 : 1

  })
	return retArray
};

export const parseGermanNumber = (
	value: string | number | undefined,
): number | null => {
	if (value === undefined || value === null || value === "") return null;
	if (typeof value === "number") return value;
	const str = String(value).trim();
	if (str === "") return null;
	const normalized = str.replace(/\./g, "").replace(/,/g, ".");
	const parsed = parseFloat(normalized);
	return isNaN(parsed) ? null : parsed;
};

const isValidReading = (
	reading: MeterReadingType,
	startDate: Date,
	endDate: Date,
): boolean => {
	return (
		hasValidStatus(reading.Status) &&
		hasNoErrorFlags(
			reading["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"],
		)
	);
	// && hasValidEnergyReading(reading)
	// && hasValidVolumeReading(reading);
	// && isWithinDateRange(reading, startDate, endDate);
};

const hasValidStatus = (status: string): boolean => {
	return (
		status === "00h" || status === "No error" || status === "Alarm (permanent)"
	);
};

const hasNoErrorFlags = (errorFlags: string | undefined): boolean => {
	return !errorFlags || errorFlags === "0b"; // Non-zero error flags indicate problems
};

// const hasValidEnergyReading = (reading: MeterReadingType): boolean => {
//
//   // Check for obvious error values in energy reading
//   // Support both OLD format (IV,0,0,0,Wh,E) and NEW format (Actual Energy / HCA)
//   const oldFormatEnergy = reading["IV,0,0,0,Wh,E"];
//   const newFormatEnergy = reading["Actual Energy / HCA"];
//   const currentValue = newFormatEnergy !== undefined ? newFormatEnergy : oldFormatEnergy;
//
//   let numValue = 0;
//   if (currentValue != null) {
//     numValue =
//       typeof currentValue === "number"
//         ? currentValue
//         : parseFloat(String(currentValue).replace(",", ".") || "0");
//   }
//   return numValue < 10000000
// }

// const hasValidVolumeReading = (reading: MeterReadingType): boolean => {
// 	// Check for error patterns in volume
// 	// Support both OLD format (IV,0,0,0,m^3,Vol) and NEW format (Actual Volume)
// 	const oldFormatVolume = reading["IV,0,0,0,m^3,Vol"];
// 	const newFormatVolume = reading["Actual Volume"];
// 	const volume =
// 		newFormatVolume !== undefined ? newFormatVolume : oldFormatVolume;
//
// 	let volumeValue = 0;
// 	if (volume != null) {
// 		volumeValue =
// 			typeof volume === "number"
// 				? volume
// 				: parseFloat(String(volume).replace(",", ".") || "0");
// 	}
// 	// Filter out obvious volume error codes (777.777, 888.888, 999.999)
// 	return (
// 		volumeValue < 777 &&
// 		(Math.abs(volumeValue - 777.777) >= 0.001 ||
// 			Math.abs(volumeValue - 888.888) >= 0.001 ||
// 			Math.abs(volumeValue - 999.999) >= 0.001)
// 	);
// };
//
// const isWithinDateRange = (
// 	reading: MeterReadingType,
// 	startDate: Date,
// 	endDate: Date,
// ): boolean => {
// 	const rangeStart = new Date(startDate);
// 	const rangeEnd = new Date(endDate);
//
// 	let dateString: string | null = null;
//
// 	const oldFormatDate = reading["IV,0,0,0,,Date/Time"];
// 	const newActualDate = reading["Actual Date"];
// 	const newRawDate = reading["Raw Date"];
//
// 	if (oldFormatDate && typeof oldFormatDate === "string") {
// 		dateString = oldFormatDate.split(" ")[0];
// 	} else if (newActualDate && typeof newActualDate === "string") {
// 		dateString = newActualDate.split(" ")[0];
// 	} else if (newRawDate && typeof newRawDate === "string") {
// 		dateString = newRawDate.replace(/-/g, ".");
// 	}
//
// 	if (!dateString) return false;
//
// 	const [day, month, year] = dateString.split(".").map(Number);
// 	const fullYear = year < 100 ? 2000 + year : year;
// 	const readingDate = new Date(fullYear, month - 1, day);
// 	return readingDate >= rangeStart && readingDate <= rangeEnd;
// };

// const getLatestDeviceReadingsMonthly = (
// 	validReadings: MeterReadingType[],
// ): Map<
// 	string,
// 	{
// 		reading: MeterReadingType;
// 		date: Date;
// 		previousReading: MeterReadingType | null;
// 		previousDate: Date | null;
// 	}
// > => {
// 	const deviceLatestReadings = new Map<
// 		string,
// 		{
// 			reading: MeterReadingType;
// 			date: Date;
// 			previousReading: MeterReadingType | null;
// 			previousDate: Date | null;
// 		}
// 	>();
//
// 	validReadings.forEach((reading) => {
// 		const deviceId = String(reading.ID || reading["Number Meter"] || "unknown");
// 		const dateString = getDateString(
// 			reading["IV,0,0,0,,Date/Time"],
// 			reading["Actual Date"],
// 			reading["Raw Date"],
// 		);
// 		const readingDate = getReadingDate(dateString);
//
// 		const existing = deviceLatestReadings.get(deviceId);
//
// 		if (!existing) {
// 			deviceLatestReadings.set(deviceId, {
// 				reading,
// 				date: readingDate,
// 				previousReading: null,
// 				previousDate: null,
// 			});
// 		} else if (readingDate > existing.date) {
// 			// New reading becomes latest — re-evaluate old latest as previous candidate
// 			const previousMonthOfNew = new Date(
// 				readingDate.getFullYear(),
// 				readingDate.getMonth() - 1,
// 				1,
// 			);
// 			const isPrevInPreviousMonth =
// 				existing.date.getFullYear() === previousMonthOfNew.getFullYear() &&
// 				existing.date.getMonth() === previousMonthOfNew.getMonth();
//
// 			deviceLatestReadings.set(deviceId, {
// 				reading,
// 				date: readingDate,
// 				// Only carry forward old latest as previous if it's from the previous calendar month
// 				previousReading: isPrevInPreviousMonth
// 					? existing.reading
// 					: existing.previousReading,
// 				previousDate: isPrevInPreviousMonth
// 					? existing.date
// 					: existing.previousDate,
// 			});
// 		} else {
// 			// This reading is older — check if it belongs to the previous calendar month of the latest
// 			const previousMonthOfExisting = new Date(
// 				existing.date.getFullYear(),
// 				existing.date.getMonth() - 1,
// 				1,
// 			);
// 			const isInPreviousMonth =
// 				readingDate.getFullYear() === previousMonthOfExisting.getFullYear() &&
// 				readingDate.getMonth() === previousMonthOfExisting.getMonth();
//
// 			if (isInPreviousMonth) {
// 				// Among all readings from the previous month, keep the latest one
// 				if (!existing.previousDate || readingDate > existing.previousDate) {
// 					deviceLatestReadings.set(deviceId, {
// 						...existing,
// 						previousReading: reading,
// 						previousDate: readingDate,
// 					});
// 				}
// 			}
// 		}
// 	});
//
// 	return deviceLatestReadings;
// };

//Not Referenced

// Helper function to get unique dates from readings
// const getUniqueDatesFromReadings = (readings: MeterReadingType[]): Date[] => {
// 	const uniqueDates = new Set<string>();
// 	const dates: Date[] = [];
//
// 	readings.forEach((reading) => {
// 		// Support both OLD format (IV,0,0,0,,Date/Time) and NEW format (Actual Date / Raw Date)
// 		const oldFormatDate = reading["IV,0,0,0,,Date/Time"];
// 		const newActualDate = reading["Actual Date"];
// 		const newRawDate = reading["Raw Date"];
//
// 		let dateString: string | null = null;
//
// 		if (oldFormatDate && typeof oldFormatDate === "string") {
// 			dateString = oldFormatDate.split(" ")[0];
// 		} else if (newActualDate && typeof newActualDate === "string") {
// 			dateString = newActualDate.split(" ")[0];
// 		} else if (newRawDate && typeof newRawDate === "string") {
// 			dateString = newRawDate.replace(/-/g, ".");
// 		}
//
// 		if (dateString && !uniqueDates.has(dateString)) {
// 			uniqueDates.add(dateString);
// 			const [day, month, year] = dateString.split(".").map(Number);
// 			dates.push(new Date(year, month - 1, day));
// 		}
// 	});
//
// 	return dates.sort((a, b) => a.getTime() - b.getTime());
// };

// Helper function that returns an array with both date and value for monthly historical data
// const getMonthlyEnergyDataWithDates = (
// 	readings: MeterReadingType[],
// ): { date: Date; value: number }[] => {
// 	const monthlyData: { date: Date; value: number }[] = [];
// 	const mostRecentDate = getRecentReadingDate(readings);
// 	if (!mostRecentDate) return [];
//
// 	for (let i = 0; i <= 30; i += 2) {
// 		const key = `IV,${i},0,0,Wh,E` as keyof MeterReadingType;
// 		const historicalDate = new Date(mostRecentDate);
// 		historicalDate.setMonth(mostRecentDate.getMonth() - i / 2);
//
// 		let totalValue = 0;
// 		readings.forEach((reading) => {
// 			const value = reading[key];
// 			if (typeof value === "string") {
// 				totalValue += parseFloat(value.replace(",", ".") || "0");
// 			} else if (typeof value === "number") {
// 				totalValue += value;
// 			}
// 		});
//
// 		monthlyData.unshift({ date: historicalDate, value: totalValue });
// 	}
//
// 	return monthlyData;
// };
// const getRecentReadingDate = (readings: MeterReadingType[]): Date | null => {
// 	if (!readings || readings.length === 0) return null;
//
// 	// Support both OLD format (IV,0,0,0,,Date/Time) and NEW format (Actual Date / Raw Date)
// 	const oldFormatDate = readings[0]["IV,0,0,0,,Date/Time"];
// 	const newActualDate = readings[0]["Actual Date"];
// 	const newRawDate = readings[0]["Raw Date"];
//
// 	let dateString: string | null = null;
//
// 	if (oldFormatDate && typeof oldFormatDate === "string") {
// 		dateString = oldFormatDate.split(" ")[0];
// 	} else if (newActualDate && typeof newActualDate === "string") {
// 		dateString = newActualDate.split(" ")[0];
// 	} else if (newRawDate && typeof newRawDate === "string") {
// 		// Convert "29-10-2025" to "29.10.2025"
// 		dateString = newRawDate.replace(/-/g, ".");
// 	}
//
// 	if (!dateString) return null;
// 	const [day, month, year] = dateString.split(".").map(Number);
// 	return new Date(year, month - 1, day);
// };

function parseHCADate(r: MeterReadingType): Date | null {
	const raw =
		r["IV,0,0,0,,Date/Time"] ??
		r["Actual Date"] ??
		r["Raw Date"] ??
		r["Billing Date"];
	if (!raw) return null;
	if (typeof raw === "string" && raw.includes(".")) {
		return parseGermanDate(raw) ?? new Date(raw);
	}
	const d = new Date(raw as string);
	return isNaN(d.getTime()) ? null : d;
}
