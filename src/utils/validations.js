/**
 * Validate if a variable is undefined or null
 * @param {any} variable variable to be validated
 */

const isUndefinedOrNull = (variable) => (typeof variable === 'undefined' || variable === null);

export default isUndefinedOrNull;
