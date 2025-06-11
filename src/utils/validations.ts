/**
 * Validate if a variable is undefined or null
 * @param {any} variable variable to be validated
 * 
 * @returns True if the variable is null or undefined, false otherwise
 */
export const isUndefinedOrNull = (variable: any) =>
  typeof variable === "undefined" || variable === null;
