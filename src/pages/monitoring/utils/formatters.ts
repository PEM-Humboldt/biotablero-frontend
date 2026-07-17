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

// NOTE: Pendiente a realizar la implementacion completa para cuando se tenga
// el formato de los detalles del log definidos
export function formatLogDescription<T>(value: T) {
  return (typeof value === "string" ? value : JSON.stringify(value)).split(
    ":",
  )[0];
}

export function indicatorsDateFormatter(
  dateObject: { year: number; month: number },
  dateEndObject?: { year: number; month: number },
) {
  const date = new Date(dateObject.year, dateObject.month - 1);
  let displayDate = date.toLocaleDateString(LOCALE, {
    month: "short",
    year: "numeric",
  });

  if (dateEndObject) {
    const endDate = new Date(dateEndObject.year, dateEndObject.month);

    const startStr = date.toLocaleDateString(LOCALE, {
      month: "short",
      year:
        date.getFullYear() === endDate.getFullYear() ? undefined : "numeric",
    });

    const endStr = endDate.toLocaleDateString(LOCALE, {
      month: "short",
      year: "numeric",
    });

    displayDate = `${startStr} - ${endStr}`;
  }

  return displayDate;
}
