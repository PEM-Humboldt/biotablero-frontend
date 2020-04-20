import colorPalettes from './colorPalettes';

// Structure to define the relation among the type of information, the palette to use and
// the order to assign the colors in the palette to the values (if any)
const match = {
  fc: {
    palette: 'rainbowFc',
    sort: [10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4],
  },
  biomas: {
    palette: 'greenBiomes',
  },
  bioticReg: {
    palette: 'bioticReg',
  },
  coverage: {
    palette: 'blue',
    sort: ['Natural', 'Secundaria', 'Transformada'],
  },
  pa: {
    palette: 'green',
    sort: ['No Protegida'],
  },
  se: {
    palette: 'seBlue',
    sort: [undefined],
  },
  biomeComp: {
    palette: 'shortFC',
    sort: ['high', 'medium', 'low'],
  },
  default: {
    palette: 'default',
  },
};

const cache = {
  biomas: { counter: 0 },
  bioticReg: { counter: 0 },
  pa: { counter: 1 },
};

/**
 * returns the color determined for a given value.
 *
 * fc and coverage have unique colors for a given value.
 * pa has unique value for 'No protegida'.
 *
 * @param {string} type type of information to apply colors.
 * Available values: fc, biomas, bioticReg, coverage, pa, se, biomeComp, default.
 *
 * @param {any} value value to asign a color, type of data will depend on type arg.
 *
 * fc will receive numbers between 4 and 10 (multiple of 0.25).
 * The rest of the types will receive strings.
 */
const matchColor = (type) => {
  const info = match[type] || match.default;
  const palette = colorPalettes[info.palette];
  const sort = info.sort || [];
  switch (type) {
    case 'fc':
      return (value) => {
        let idx = sort.indexOf(value);
        if (idx === -1) idx = sort.indexOf(value + 0.25);
        if (idx === -1) return null;
        return palette[idx];
      };
    case 'biomas':
    case 'bioticReg':
      return (value) => {
        if (cache[type][value]) return cache[type][value];
        const { counter } = cache[type];
        cache[type][value] = palette[counter];
        cache[type].counter = counter === palette.length - 1 ? 0 : counter + 1;
        return palette[counter];
      };
    case 'coverage':
    case 'biomeComp':
      return (value) => {
        const idx = sort.indexOf(value);
        if (idx === -1) return palette[palette.length - 1];
        return palette[idx];
      };
    case 'pa':
      return (value) => {
        const idx = sort.indexOf(value);
        if (idx !== -1) return palette[idx];
        if (cache.pa[value]) return cache.pa[value];
        const { counter } = cache.pa;
        cache.pa[value] = palette[counter];
        cache.pa.counter = counter === palette.length - 1 ? sort.length : counter + 1;
        return palette[counter];
      };
    case 'se':
      return (value) => {
        const idx = sort.indexOf(value);
        if (idx === -1) return palette[palette.length - 1];
        return palette[idx];
      };
    default:
      return palette[0];
  }
};

export default matchColor;