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

export function formatLogDescription<T>(value: T) {
  return (typeof value === "string" ? value : JSON.stringify(value)).split(
    ":",
  )[0];
}
