import colorPalettes from "pages/search/utils/colorPalettes";

// Structure to define the relation among the type of information, the palette to use and
// the order to assign the colors in the palette to the values (if any)
const match = {
  fc: {
    palette: "rainbowFc",
    sort: [10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4],
  },
  biomas: {
    palette: "greenBiomes",
  },
  bioticReg: {
    palette: "bioticReg",
  },
  coverage: {
    palette: "coverage",
    sort: ["N", "S", "T"],
  },
  pa: {
    palette: "pa",
    sort: ["No Protegida"],
  },
  se: {
    palette: "seBlue",
    sort: ["NA"],
  },
  biomeComp: {
    palette: "shortFC",
    sort: ["high", "medium", "low"],
  },
  hfTimeline: {
    palette: "hfTimeline",
    // TODO: The id part could change once the API endpoint is implemented
    sort: [
      "aTotal",
      "aTotalSel",
      "paramo",
      "paramoSel",
      "dryForest",
      "dryForestSel",
      "wetland",
      "wetlandSel",
    ],
  },
  hfCurrent: {
    palette: "hfCurrent",
    // TODO: This could change once the API endpoint is implemented
    sort: ["natural", "baja", "media", "alta"],
  },
  hfPersistence: {
    palette: "hfPersistence",
    // TODO: This could change once the API endpoint is implemented
    sort: ["estable_natural", "dinamica", "estable_alta"],
  },
  paramo: {
    palette: "paramo",
    sort: ["paramo"],
  },
  dryForest: {
    palette: "dryForest",
    sort: ["dryForest"],
  },
  wetland: {
    palette: "wetland",
    sort: ["wetland"],
  },
  paramoPAConn: {
    palette: "sePAConn",
  },
  dryForestPAConn: {
    palette: "sePAConn",
  },
  wetlandPAConn: {
    palette: "sePAConn",
  },
  forestLP: {
    palette: "forestLP",
    sort: ["persistencia", "perdida", "ganancia", "no_bosque"],
  },
  SciHf: {
    palette: "SciHf",
    sort: [
      "alta-estable_natural",
      "alta-dinamica",
      "alta-estable_alta",
      "baja_moderada-estable_natural",
      "baja_moderada-dinamica",
      "baja_moderada-estable_alta",
    ],
  },
  currentPAConn: {
    palette: "currentPAConn",
    sort: ["prot_conn", "prot_unconn", "unprot"],
  },
  dpc: {
    palette: "dpc",
    sort: ["muy_bajo", "bajo", "medio", "alto", "muy_alto"],
  },
  timelinePAConn: {
    palette: "timelinePAConn",
    sort: ["prot", "protSel", "prot_conn", "prot_connSel"],
  },
  richnessNos: {
    palette: "richnessNos",
    // first values, then limits, then backgrounds, then legend limits
    sort: [
      "inferred",
      "observed",
      "min_inferred",
      "min_observed",
      "max_inferred",
      "max_observed",
      "region_inferred",
      "region_observed",
      "area",
      "region",
      "legend-from",
      "legend-to",
    ],
  },
  richnessGaps: {
    palette: "richnessGaps",
    // first values, then limits, then backgrounds
    sort: [
      "value",
      "min",
      "max",
      "min_threshold",
      "max_threshold",
      "min_region",
      "max_region",
      "area",
      "legend-from",
      "legend-middle",
      "legend-to",
    ],
  },
  caTargets: {
    palette: "caTargets",
    sort: [
      "Biod · SS.EE. · Riesgo",
      "ELSA",
      "Rest · WePlan",
      "Biod · Carbono · Agua",
      "ACC · Biod. Acuática",
    ],
  },
  functionalDryForestValues: {
    palette: "functionalDryForestValues",
    sort: ["value", "value_nal"],
  },
  functionalDFFeatureLA: {
    palette: "functionalDFFeatureLA",
    // first values, then limits, then backgrounds
    sort: ["value", "min", "max", "area"],
  },
  functionalDFFeatureLN: {
    palette: "functionalDFFeatureLN",
    // first values, then limits, then backgrounds
    sort: ["value", "min", "max", "area"],
  },
  functionalDFFeaturePH: {
    palette: "functionalDFFeaturePH",
    // first values, then limits, then backgrounds
    sort: ["value", "min", "max", "area"],
  },
  functionalDFFeatureSLA: {
    palette: "functionalDFFeatureSLA",
    // first values, then limits, then backgrounds
    sort: ["value", "min", "max", "area"],
  },
  functionalDFFeatureSSD: {
    palette: "functionalDFFeatureSSD",
    // first values, then limits, then backgrounds
    sort: ["value", "min", "max", "area"],
  },
  functionalDFFeatureSM: {
    palette: "functionalDFFeatureSM",
    // first values, then limits, then backgrounds
    sort: ["value", "min", "max", "area"],
  },
  polygon: {
    palette: "polygon",
  },
  border: {
    palette: "border",
  },
  default: {
    palette: "default",
  },
};

const cache = {
  biomas: { counter: 0 },
  bioticReg: { counter: 0 },
  pa_counter: 1,
};

/**
 * returns the color determined for a given value.
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
    case "fc":
      return (value) => {
        const numValue = parseFloat(value);
        let idx = sort.indexOf(numValue);
        if (idx === -1) idx = sort.indexOf(numValue + 0.25);
        if (idx === -1) return null;
        return palette[idx];
      };
    case "biomas":
    case "bioticReg":
      return (value) => {
        if (cache[type][value]) return cache[type][value];
        const { counter } = cache[type];
        cache[type][value] = palette[counter];
        cache[type].counter = counter === palette.length - 1 ? 0 : counter + 1;
        return palette[counter];
      };
    case "pa":
      if (resetCache) {
        cache.pa_counter = 1;
      }
      return (value) => {
        const idx = sort.indexOf(value);
        if (idx !== -1) return palette[idx];
        const { pa_counter: counter } = cache;
        cache.pa_counter = counter === palette.length - 1 ? 1 : counter + 1;
        return palette[counter];
      };
    case "hfPersistence":
    case "hfCurrent":
    case "coverage":
    case "biomeComp":
    case "hfTimeline":
    case "forestLP":
    case "SciHf":
    case "forestIntegrity":
    case "currentPAConn":
    case "dpc":
    case "timelinePAConn":
    case "caTargets":
    case "se":
      return (value) => {
        const idx = sort.indexOf(value);
        if (idx === -1) return palette[palette.length - 1];
        return palette[idx];
      };
    case "paramo":
    case "dryForest":
    case "wetland":
    case "richnessNos":
    case "richnessGaps":
    case "functionalDryForestValues":
    case "functionalDFFeatureLA":
    case "functionalDFFeatureLN":
    case "functionalDFFeaturePH":
    case "functionalDFFeatureSLA":
    case "functionalDFFeatureSSD":
    case "functionalDFFeatureSM":
      return (value) => {
        const idx = sort.indexOf(value);
        if (idx === -1) return null;
        return palette[idx];
      };
    case "border":
    case "polygon":
    default:
      return () => palette[0];
  }
};

export default matchColor;
