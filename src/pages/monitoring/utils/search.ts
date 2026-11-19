/**
 * Performs a fuzzy search to determine if the characters of a search string
 * appear sequentially within a target string.
 *
 * @param lookForSanitized - The sanitized, lowercase search query.
 * @param intoLowerSanitized - The sanitized, lowercase target string to search within.
 * @returns `true` if the search string is empty or its characters are found in order inside the target string; otherwise, `false`.
 */
export function fuzzySearch(
  lookForSanitized: string,
  intoLowerSanitized: string,
) {
  if (!lookForSanitized) {
    return true;
  }

  if (lookForSanitized.length > intoLowerSanitized.length) {
    return false;
  }

  if (lookForSanitized.length === intoLowerSanitized.length) {
    return lookForSanitized === intoLowerSanitized;
  }

  let lookForIdx = 0;
  for (let intoIdx = 0; intoIdx < intoLowerSanitized.length; intoIdx++) {
    if (lookForSanitized[lookForIdx] === intoLowerSanitized[intoIdx]) {
      lookForIdx++;
    }
    if (lookForIdx === lookForSanitized.length) {
      return true;
    }
  }

  return false;
}

/**
 * Evaluates whether a set of item categories satisfies the active filter criteria
 * using either intersection (AND) or union (OR) logic.
 *
 * @param activeFilters - The array of currently selected filters.
 * @param containFilters - The array of categories belonging to the item being evaluated.
 * @param isAnd - Optional flag. If `true`, requires all active filters to match (AND). If `false`, requires at least one match (OR). Defaults to `false`.
 * @returns `true` if active filters are empty or the matching condition is satisfied; otherwise, `false`.
 */
export function hasFilters(
  activeFilters: string[],
  containFilters: string[],
  isAnd: boolean = false,
) {
  if (activeFilters.length === 0) {
    return true;
  }

  return isAnd
    ? activeFilters.every((filter) => containFilters.includes(filter))
    : activeFilters.some((filter) => containFilters.includes(filter));
}
