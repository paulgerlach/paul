import {
  differenceInCalendarMonths,
  parse,
  isValid,
} from "date-fns";

export function useDiffInMonths(
  startDateStr?: string | null,
  endDateStr?: string | null
): number {
  const dateFormats = [
    "yyyy-MM-dd'T'HH:mm:ss.SSSX",
    "yyyy-MM-dd HH:mm:ss.SSSX",
    "yyyy-MM-dd HH:mm:ssX",
    "yyyy-MM-dd",
    "dd.MM.yyyy",
    "MM/dd/yyyy",
    "yyyy/MM/dd",
  ];

  const parseDateWithMultipleFormats = (dateString: string): Date => {
    for (const format of dateFormats) {
      const parsedDate = parse(dateString, format, new Date());
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    }
    return new Date('Invalid Date');
  };

  const parsedStart = startDateStr
    ? parseDateWithMultipleFormats(startDateStr)
    : new Date('Invalid Date');

  const parsedEnd = endDateStr
    ? parseDateWithMultipleFormats(endDateStr)
    : new Date('Invalid Date');

  if (!isValid(parsedStart) || !isValid(parsedEnd)) {
    return 0;
  }

  let monthsDiff = differenceInCalendarMonths(parsedEnd, parsedStart) + 1;

  return monthsDiff < 1 ? 1 : monthsDiff;
}
