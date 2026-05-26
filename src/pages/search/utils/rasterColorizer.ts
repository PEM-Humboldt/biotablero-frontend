const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

type RGB = { r: number; g: number; b: number };

const colorizedRasterCache = new Map<string, Promise<string>>();

function normalizeHexColor(color: string): string {
  const candidate = color.trim();

  if (!HEX_COLOR_REGEX.test(candidate)) {
    throw new Error(`Invalid hex color: ${color}`);
  }

  if (candidate.length === 4) {
    const [_, r, g, b] = candidate;
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return candidate.toLowerCase();
}

function hexToRgb(hex: string): RGB {
  const normalizedHex = normalizeHexColor(hex);

  return {
    r: Number.parseInt(normalizedHex.slice(1, 3), 16),
    g: Number.parseInt(normalizedHex.slice(3, 5), 16),
    b: Number.parseInt(normalizedHex.slice(5, 7), 16),
  };
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    // Needed for non-data URLs where CORS headers are enabled.
    image.crossOrigin = "anonymous";

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load raster image"));

    image.src = source;
  });
}

function colorizeRasterFromAlpha(source: string, rgb: RGB): Promise<string> {
  return loadImage(source).then((image) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      throw new Error("Unable to acquire 2D canvas context");
    }

    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha === 0) {
        continue;
      }

      data[i] = rgb.r;
      data[i + 1] = rgb.g;
      data[i + 2] = rgb.b;
      // Keep original alpha for anti-aliased edges.
      data[i + 3] = alpha;
    }

    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
  });
}

/**
 * Recolors a raster image preserving each pixel alpha and replacing its RGB with the provided hex color.
 *
 * The operation is cached by `source + color` to avoid repeated per-pixel processing.
 */
export async function colorizeRasterByAlphaMask(
  source: string,
  color: string,
): Promise<string> {
  const normalizedHex = normalizeHexColor(color);
  const cacheKey = `${source}|${normalizedHex}`;

  if (!colorizedRasterCache.has(cacheKey)) {
    const rgb = hexToRgb(normalizedHex);
    colorizedRasterCache.set(cacheKey, colorizeRasterFromAlpha(source, rgb));
  }

  return colorizedRasterCache.get(cacheKey)!;
}

export function clearRasterColorizerCache() {
  colorizedRasterCache.clear();
}
