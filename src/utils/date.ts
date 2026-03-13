import { MeterReadingType } from "./parser";

export const getRecentReadingDate = (readings: MeterReadingType[]): Date | null => {
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

export const getDateString = (oldFormatDate: string | undefined, newActualDate: string | undefined, newRawDate: string | undefined): string | null => {


  if (oldFormatDate && typeof oldFormatDate === "string") {
    return oldFormatDate.split(" ")[0];
  } else if (newActualDate && typeof newActualDate === "string") {
    return newActualDate.split(" ")[0];
  } else if (newRawDate && typeof newRawDate === "string") {
    return newRawDate.replace(/-/g, ".");
  }
  return null;
}

export const getReadingDate = (dateString: string | null) => {
  if (dateString && dateString !== "00.00.00") {
    const [day, month, year] = dateString.split(".").map(Number);
    const fullYear = year < 100 ? 2000 + year : year;
    return new Date(fullYear, month - 1, day);
  }
  return new Date(0);
}