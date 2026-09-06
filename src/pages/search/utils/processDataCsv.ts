/**
 * Flattens nested line series data into a unified array structure suited for CSV export.
 *
 * @template T - Array type extending objects with a key and nested data points.
 *
 * @param data - The line series dataset to transform.
 *
 * @returns A flattened array of objects with the series key along with x and y values
 */
export function processLineSeriesDataToCsv<
  T extends {
    key: string;
    data: { x: string | number; y: number }[];
  }[],
>(data: T) {
  return data.flatMap((obj) =>
    obj.data.map((values) => ({
      key: obj.key,
      x: values.x,
      y: values.y,
    })),
  );
}
