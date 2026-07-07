import { LOCALE } from "@config/monitoring";

/**
 * Formats the date value of a log into a localized string.
 *
 * @template T - Input value type (Date, string, or number)
 * @param value - Date value to format
 * @returns Formatted date string (MMM DD, YYYY, HH:MM) or the original string if invalid
 */
export function formatLogDate<T>(value: T) {
  let logDate: Date;
  if (value instanceof Date) {
    logDate = value;
  } else {
    logDate = new Date(value as string | number);
  }
  return isNaN(logDate.getTime())
    ? String(logDate)
    : logDate.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
}

/**
 * Formats a month value (name or number) into a localized string based on the current year.
 *
 * @param month - Month value to format (English name string, or number index)
 * @param [isShort=true] - Determines whether to return the short abbreviation or full name
 * @param [hasMonthOffset=true] - If true, treats numbers as 1-12 (Base 1). If false, treats them as 0-11 (Base 0)
 * @returns Formatted month string in the configured locale or the original string if invalid
 */
export function getLocaleMonthString(month: string, isShort: boolean): string;
export function getLocaleMonthString(
  month: number,
  isShort: boolean,
  hasMonthOffset: boolean,
): string;
export function getLocaleMonthString(
  month: string | number,
  isShort: boolean = true,
  hasMonthOffset: boolean = true,
): string {
  const currentYear = new Date().getFullYear();

  const date =
    typeof month === "number"
      ? new Date(currentYear, month - (hasMonthOffset ? 1 : 0), 1)
      : new Date(`${month} 1, ${currentYear}`);

  if (isNaN(date.getTime())) {
    return String(month);
  }

  return new Intl.DateTimeFormat(LOCALE, { month: isShort ? "short" : "long" })
    .format(date)
    .replace(".", "");
}

// TODO: Pendiente a realizar la implementacion completa para cuando se tenga
// el formato de los detalles del log definidos
export function formatLogDescription<T>(value: T) {
  return (typeof value === "string" ? value : JSON.stringify(value)).split(
    ":",
  )[0];
}
