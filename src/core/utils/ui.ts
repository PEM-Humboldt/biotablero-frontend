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
    return Math.round(value * 100) / 100;
  });
}
