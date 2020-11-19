/**
 * Give format to a number and set max number of decimals
 * @param {String | Number} value value to be formatted
 * @param {Number} decimals percentage value
 */

const formatNumber = (value, decimals) => Number(value).toLocaleString('en-US', { maximumFractionDigits: decimals });

export default formatNumber;
