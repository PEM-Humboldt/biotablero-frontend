type RGB = {
  r: number;
  g: number;
  b: number;
};

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function normalizeHexColor(color: string): string {
  const candidate = color.trim();

  if (!HEX_COLOR_REGEX.test(candidate)) {
    throw new Error(`Invalid hex color: ${color}`);
  }

  if (candidate.length === 4) {
    const [, r, g, b] = candidate;
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

function rgbToHsl({ r, g, b }: RGB) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  if (delta === 0) {
    return { hue: 0, saturation: 0, lightness };
  }

  const saturation =
    delta / (1 - Math.abs(2 * lightness - 1) || Number.EPSILON);

  let hue = 0;
  if (max === red) {
    hue = ((green - blue) / delta) % 6;
  } else if (max === green) {
    hue = (blue - red) / delta + 2;
  } else {
    hue = (red - green) / delta + 4;
  }

  hue *= 60;
  if (hue < 0) {
    hue += 360;
  }

  return { hue, saturation, lightness };
}

/**
 * Builds a best-effort CSS filter chain for tinting monochrome rasters.
 *
 * This is less exact than canvas or SVG filters, but it keeps the work in CSS
 * and is handy when the source is a black silhouette or grayscale PNG.
 */
export function buildCssColorFilter(color: string): string {
  const rgb = hexToRgb(color);
  const { hue, saturation, lightness } = rgbToHsl(rgb);

  const invertAmount = Math.round((1 - lightness) * 100);
  const saturateAmount = Math.max(200, Math.round(100 + saturation * 3000));
  const brightnessAmount = Math.max(
    45,
    Math.min(180, Math.round(45 + lightness * 135)),
  );
  const contrastAmount = Math.max(
    70,
    Math.min(180, Math.round(100 + (0.5 - Math.abs(lightness - 0.5)) * 160)),
  );

  return [
    `brightness(0)`,
    `saturate(100%)`,
    `invert(${invertAmount}%)`,
    `sepia(100%)`,
    `saturate(${saturateAmount}%)`,
    `hue-rotate(${Math.round(hue)}deg)`,
    `brightness(${brightnessAmount}%)`,
    `contrast(${contrastAmount}%)`,
  ].join(" ");
}
