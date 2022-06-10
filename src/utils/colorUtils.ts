/* eslint-disable no-bitwise */
/**
 * Lighten or darken color base on percent sign. Taken from https://gist.github.com/renancouto/4675192
 * @param {String} color Hex color
 * @param {Number} percent percentage value
 */
const changeColor = (color: string, percent: number) => {
  const num: number = parseInt(color.replace('#', ''), 16);
  const amt: number = Math.round(2.55 * percent);
  const R: number = (num >> 16) + amt;
  const B: number = ((num >> 8) & 0x00FF) + amt;
  const G: number = (num & 0x0000FF) + amt;

  const newR: number = R < 1 ? 0 : R;
  const newB: number = B < 1 ? 0 : B;
  const newG: number = G < 1 ? 0 : G;

  return `#${(
    0x1000000
    + (R < 255 ? newR : 255) * 0x10000
    + (B < 255 ? newB : 255) * 0x100
    + (G < 255 ? newG : 255)
  ).toString(16).slice(1)}`;
};

const lightenColor = (color: string, percent: number) => changeColor(color, percent);
const darkenColor = (color: string, percent: number) => changeColor(color, percent * -1);

export { lightenColor, darkenColor };
