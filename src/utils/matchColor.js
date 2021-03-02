import colorPalettes from 'utils/colorPalettes';

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
    sort: ['N', 'S', 'T'],
  },
  pa: {
    palette: 'green',
    sort: ['No Protegida'],
  },
  se: {
    palette: 'seBlue',
    sort: ['NA'],
  },
  biomeComp: {
    palette: 'shortFC',
    sort: ['high', 'medium', 'low'],
  },
  hfTimeline: {
    palette: 'hfTimeline',
    // TODO: The id part could change once the API endpoint is implemented
    sort: [
      'aTotal',
      'aTotalSel',
      'paramo',
      'paramoSel',
      'dryForest',
      'dryForestSel',
      'wetland',
      'wetlandSel',
    ],
  },
  hfCurrent: {
    palette: 'hfCurrent',
    // TODO: This could change once the API endpoint is implemented
    sort: ['natural', 'baja', 'media', 'alta'],
  },
  hfPersistence: {
    palette: 'hfPersistence',
    // TODO: This could change once the API endpoint is implemented
    sort: ['estable_natural', 'dinamica', 'estable_alta'],
  },
  paramo: {
    palette: 'paramo',
    sort: ['paramo'],
  },
  dryForest: {
    palette: 'dryForest',
    sort: ['dryForest'],
  },
  wetland: {
    palette: 'wetland',
    sort: ['wetland'],
  },
  forestLP: {
    palette: 'forestLP',
    sort: ['persistencia', 'perdida', 'ganancia', 'no_bosque'],
  },
  SciHf: {
    palette: 'SciHf',
    sort: ['alta-estable_alta',
      'alta-dinamica',
      'alta-estable_natural',
      'baja_moderada-estable_alta',
      'baja_moderada-dinamica',
      'baja_moderada-estable_natural',
    ],
  },
  forestIntegrity: {
    palette: 'forestIntegrity',
    sort: ['baja_moderada', 'alta'],
  },
  border: {
    palette: 'border',
    sort: ['white'],
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
 * @param {boolean} resetCache whether to clean the cache before assigning colors. Applies to 'pa'
 *
 * @param {any} value value to assign a color, type of data will depend on type arg.
 *
 * fc will receive numbers between 4 and 10 (multiple of 0.25).
 * The rest of the types will receive strings.
 */
const matchColor = (type, resetCache = false) => {
  const info = match[type] || match.default;
  const palette = colorPalettes[info.palette];
  const sort = info.sort || [];
  switch (type) {
    case 'fc':
      return (value) => {
        const numValue = parseFloat(value);
        let idx = sort.indexOf(numValue);
        if (idx === -1) idx = sort.indexOf(numValue + 0.25);
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
    case 'pa':
      if (resetCache) {
        cache.pa = { counter: 1 };
      }
      return (value) => {
        const idx = sort.indexOf(value);
        if (idx !== -1) return palette[idx];
        if (cache.pa[value]) return cache.pa[value];
        const { counter } = cache.pa;
        cache.pa[value] = palette[counter];
        cache.pa.counter = counter === palette.length - 1 ? sort.length : counter + 1;
        return palette[counter];
      };
    case 'hfPersistence':
    case 'hfCurrent':
    case 'coverage':
    case 'biomeComp':
    case 'hfTimeline':
    case 'forestLP':
    case 'SciHf':
    case 'forestIntegrity':
    case 'se':
    case 'border':
      return (value) => {
        const idx = sort.indexOf(value);
        if (idx === -1) return palette[palette.length - 1];
        return palette[idx];
      };
    case 'paramo':
    case 'dryForest':
    case 'wetland':
      return (value) => {
        const idx = sort.indexOf(value);
        if (idx === -1) return null;
        return palette[idx];
      };
    default:
      return () => palette[0];
  }
};

export default matchColor;
