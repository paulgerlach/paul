import {
  differenceInCalendarMonths,
  parse,
  isValid,
  isSameMonth,
} from "date-fns";

export function useDiffInMonths(
  startDateStr: string,
  endDateStr: string
): number {
  const parsedStart = parse(startDateStr, "dd.MM.yyyy", new Date());
  const parsedEnd = parse(endDateStr, "dd.MM.yyyy", new Date());

  if (!isValid(parsedStart) || !isValid(parsedEnd)) return 0;

  let monthsDiff = differenceInCalendarMonths(parsedEnd, parsedStart);

  if (!isSameMonth(parsedStart, parsedEnd)) {
    monthsDiff += 1;
  } else {
    monthsDiff = 1;
  }

  return monthsDiff;
}
