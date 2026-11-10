import {
  MONITORING_EVENTS_MAX_PER_MONTH,
  MONITORING_EVENTS_MIN_PER_MONTH,
} from "@config/monitoring";

export function isAmountValid(amount: number): boolean {
  return (
    amount >= MONITORING_EVENTS_MIN_PER_MONTH &&
    amount <= MONITORING_EVENTS_MAX_PER_MONTH
  );
}

export function isDateValid(date: Date): boolean {
  const now = new Date();

  const isPastYear = date.getFullYear() < now.getFullYear();
  const isCurrentYearValidMonth =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() <= now.getMonth();

  return isPastYear || isCurrentYearValidMonth;
}

export function isNewEvent(date: Date): boolean {}
