import colorPalettes from './colorPalettes';

// Structure to define the relation among the type of information, the palette to use and
// the order to assign the colors in the palette to the values (if any)
const match = {
  fc: {
    palette: 'rainbowFc',
    sort: [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
  },
  biomas: {
    palette: 'greenBiomes',
  },
  bioticReg: {
    palette: 'bioticReg',
  },
  coverage: {
    palette: 'blue',
    sort: 'N-S-T-others',
  },
  pa: {
    palette: 'green',
    sort: 'No protegida - others',
  },
};

/**
 * returns the color determined for a given value.
 *
 * fc and coverage have unique colors for a given value.
 * pa has unique value for 'No protegida'.
 *
 * @param {string} type type of information to apply colors.
 * Available values: fc, biomas, bioticReg, coverage, pa.
 *
 * @param {any} value value to asign a color, type of data will depend on type arg.
 *
 * fc will receive numbers between 4 and 10 (multiple of 0.25).
 * biomas, bioticReg, coverage and pa will receive strings
 */
const matchColor = (type) => {
  const palette = colorPalettes[match[type].palette];
  const sort = match[type].sort || null;
  switch (type) {
    case 'fc':
      return (value) => {
        let idx = sort.indexOf(value);
        if (idx === -1) idx = sort.indexOf(value + 0.25);
        if (idx === -1) return null;
        return palette[idx];
      };
    default:
      return '#345b6b';
  }
}

export default matchColor;
