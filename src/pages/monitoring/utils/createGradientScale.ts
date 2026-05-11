type ColorStop = {
  color: string;
  position: number; // Valor de 0 a 1
};

const hexToRgb = (hex: string) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

const decToHex = (n: number) => n.toString(16).padStart(2, "0");

export function createGradientScale(
  min: number,
  max: number,
  stops: ColorStop[],
) {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);

  return function getColor(count: number) {
    if (count <= 0) {
      return "transparent";
    }

    const t = Math.min(Math.max((count - min) / (max - min), 0), 1);

    let upperIndex = sortedStops.findIndex((s) => s.position >= t);

    if (upperIndex === -1) {
      upperIndex = sortedStops.length - 1;
    } else if (upperIndex === 0) {
      upperIndex = 1;
    }

    const lower = sortedStops[upperIndex - 1];
    const upper = sortedStops[upperIndex];

    // 3. Normalización local (0 a 1 dentro del segmento)
    const range = upper.position - lower.position;
    const localT = range === 0 ? 0 : (t - lower.position) / range;

    const c1 = hexToRgb(lower.color);
    const c2 = hexToRgb(upper.color);

    const r = Math.round(c1.r + localT * (c2.r - c1.r));
    const g = Math.round(c1.g + localT * (c2.g - c1.g));
    const b = Math.round(c1.b + localT * (c2.b - c1.b));

    return `#${decToHex(r)}${decToHex(g)}${decToHex(b)}`;
  };
}
