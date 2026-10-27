import { imagesBank } from "@assets/dictionaries/randomImagesBank";

export const inputLengthCount = (
  currentString: string,
  maxLength: number,
  threshold: number = 0.9,
) => {
  return currentString.length > Math.floor(maxLength * threshold)
    ? `${currentString.length} / ${maxLength}`
    : "";
};

export const inputWarnColor = (
  currentStringOrStringLength: string | number,
  maxLength: number,
  threshold: number = 0.95,
) => {
  const currentLength =
    typeof currentStringOrStringLength === "number"
      ? currentStringOrStringLength
      : currentStringOrStringLength.length;
  return currentLength > Math.floor(maxLength * threshold)
    ? "text-accent"
    : "text-primary";
};

export function getRandomImageURL() {
  const seed = Math.floor(Math.random() * imagesBank.length);

  return imagesBank[seed];
}

/**
 * Generates an array of linearly distributed numeric ticks.
 *
 * @param min - The lower bound of the tick range.
 * @param max - The upper bound of the tick range.
 * @param steps - The total number of ticks to generate.
 *
 * @returns An array of `steps` numbers evenly spaced between `min` and `max`, rounded to two decimal places.
 */
export function generateLinearTicks(
  min: number,
  max: number,
  steps: number,
): number[] {
  if (steps <= 0) {
    return [];
  }
  if (steps === 1) {
    return [min];
  }
  if (min === max) {
    return Array<number>(steps).fill(min);
  }

  const stepSize = (max - min) / (steps - 1);

  return Array.from({ length: steps }, (_, i) => {
    const value = min + i * stepSize;
    return Math.round(value);
  });
}

/**
 * Builds the display labels for a histogram's bins from its numeric bin edges.
 *
 * The bins are sorted in ascending order and, optionally, truncated at a compression
 * point and/or partially grouped into ranges.
 *
 * @param bins - The numeric bin values.
 * @param grouped - Defines which bins are shown as ranges instead of values,
 * or `null`to show every bin as a single value.
 * @param grouped.fromIndex - Index of the first bin to be shown as a range.
 * @param grouped.tillIndex - Index (exclusive) at which the grouping stops.
 * If omitted, grouping continues up to the last bin.
 */
export function makeCustomHistogramBinsLabels(
  bins: number[],
  grouped: {
    fromIndex: number;
    tillIndex?: number;
  } | null,
  compresorFromIndex: number | null,
): string[] {
  const sortedBins = bins
    .toSorted((a, b) => a - b)
    .slice(0, compresorFromIndex ?? bins.length);

  const indexFrom = grouped?.fromIndex ?? sortedBins.length;
  const indexUntil = Math.max(
    indexFrom,
    grouped?.tillIndex ?? sortedBins.length,
  );

  const customBins = sortedBins.map((bin, index, arr) =>
    index >= indexFrom && index < indexUntil && arr[index + 1] !== undefined
      ? `${bin}-${arr[index + 1] - 1}`
      : String(bin),
  );

  if (compresorFromIndex) {
    customBins[customBins.length - 1] =
      `>${customBins[customBins.length - 1].replace(/-.*$/, "")}`;
  }

  return customBins;
}
