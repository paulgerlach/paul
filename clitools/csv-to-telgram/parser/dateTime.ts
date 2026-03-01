import type { EvaluatedData } from "wireless-mbus-parser";

export const getDateTimeFromData = (
  deviceId: string,
  rawData: EvaluatedData[],
): string | null => {
  let dateTime = rawData.filter((m) => m.type === "DateTime");
  if (!dateTime || dateTime.length === 0) {
    throw {
      deviceId,
      message: `[${deviceId}] "Could not FIND DateTime in record`,
      name: "NO_DATE_TIME",
    };
  }

  let evaluatedDate = dateTime[0];
  let date = evaluatedDate?.value as Date;

  let parsedDateTime = date.toISOString().split("T")[0];
  if (!parsedDateTime) {
    throw {
      deviceId,
      message: `[${deviceId}] "Could not PARSE DateTime from record`,
      name: "BAD_DATE_TIME",
    };
  }
  return parsedDateTime;
};
