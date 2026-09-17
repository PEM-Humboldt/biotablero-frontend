import { LOCALE } from "@config/monitoring";

/**
 * Give format to a number and set max number of decimals
 *
 * @param value - number to be formatted
 * @param decimals - max amount of decimals percentage value
 */
export function formatNumber(value: string | number, decimals: number) {
  return Number(value).toLocaleString(LOCALE, {
    maximumFractionDigits: decimals,
  });
}

/*
 * Transforms fast any string to a number within a range from 0 to a fixed and consistent number
 */
export function hashStringToRange(str: string, range: number = 10): number {
  let hash = 5381;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }

  return Math.abs(hash) % (range + 1);
}
