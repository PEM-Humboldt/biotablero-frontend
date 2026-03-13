import colorPalettes from "pages/search/utils/colorPalettes";

type MatchColorType = keyof typeof match;
interface MatchInfo {
  palette: keyof typeof colorPalettes;
  sort?: (string | number)[];
}

type ColorValue = string | number;
type ColorResult = string | null;
type ColorMapper = (value?: string | number) => ColorResult;
interface CyclicCache {
  counter: number;
  [key: string]: string | number;
}

// Structure to define the relation among the type of information, the palette to use and
// the order to assign the colors in the palette to the values (if any)
// first values, then limits, then backgrounds
export const match = {
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
    sort: ["Natural", "Secundaria", "Transformada"],
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
    sort: ["Natural", "Baja", "Media", "Alta", "Muy Alta"],
  },
  hfPersistence: {
    palette: "hfPersistence",
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
  forestLP: {
    palette: "forestLP",
    sort: ["Persistencia", "Perdida", "Ganancia", "No Bosque"],
  },
  forestIntegrity: {
    palette: "forestIntegrity",
    sort: [],
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
    sort: ["value", "min", "max", "area"],
  },
  functionalDFFeatureLN: {
    palette: "functionalDFFeatureLN",
    sort: ["value", "min", "max", "area"],
  },
  functionalDFFeaturePH: {
    palette: "functionalDFFeaturePH",
    sort: ["value", "min", "max", "area"],
  },
  functionalDFFeatureSLA: {
    palette: "functionalDFFeatureSLA",
    sort: ["value", "min", "max", "area"],
  },
  functionalDFFeatureSSD: {
    palette: "functionalDFFeatureSSD",
    sort: ["value", "min", "max", "area"],
  },
  functionalDFFeatureSM: {
    palette: "functionalDFFeatureSM",
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
} as const satisfies Record<string, MatchInfo>;

const cache: {
  biomas: CyclicCache;
  bioticReg: CyclicCache;
  pa_counter: number;
} = {
  biomas: { counter: 0 },
  bioticReg: { counter: 0 },
  pa_counter: 1,
};

/**
 * returns the color determined for a given value.
 *
 * @param {string} type - type of information to apply colors.
 * @param {boolean} [resetCache=false] - whether to clean the cache before assigning colors. Applies to 'pa'
 *
 * @param {any} value - value to assign a color, type of data will depend on type arg.
 *
 * fc will receive numbers between 4 and 10 (multiple of 0.25).
 * The rest of the types will receive strings.
 *
 * @returns {function(string | number): (string | null)} A function that takes a value and returns a color string or null.
 */

export const matchColor = (
  type: MatchColorType,
  resetCache = false,
): ColorMapper => {
  const info: MatchInfo = match[type] ?? match.default;
  const palette = colorPalettes[info.palette];
  const sort = info.sort ?? [];

  switch (type) {
    case "fc":
      return (value?: ColorValue): ColorResult => {
        if (value === undefined) return null;

        const numValue = Number(value);
        if (Number.isNaN(numValue)) return null;

        let idx = sort.indexOf(numValue);
        if (idx === -1) idx = sort.indexOf(numValue + 0.25);

        return idx === -1 ? null : palette[idx];
      };

    case "biomas":
    case "bioticReg":
      return (value?: ColorValue): ColorResult => {
        if (value === undefined) return null;

        const key = String(value);
        const bucket = cache[type];

        if (bucket[key]) return bucket[key] as string;

        const color = palette[bucket.counter];
        bucket[key] = color;
        bucket.counter =
          bucket.counter === palette.length - 1 ? 0 : bucket.counter + 1;

        return color;
      };

    case "pa":
      if (resetCache) cache.pa_counter = 1;

      return (value?: ColorValue): ColorResult => {
        if (value === undefined) return null;

        const idx = sort.indexOf(value);
        if (idx !== -1) return palette[idx];

        const color = palette[cache.pa_counter];
        cache.pa_counter =
          cache.pa_counter === palette.length - 1 ? 1 : cache.pa_counter + 1;

        return color;
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
      return (value?: ColorValue): ColorResult => {
        if (value === undefined) return null;

        const idx = sort.indexOf(value);
        return idx === -1 ? palette[palette.length - 1] : palette[idx];
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
      return (value?: ColorValue): ColorResult => {
        if (value === undefined) return null;

        const idx = sort.indexOf(value);
        return idx === -1 ? null : palette[idx];
      };

    case "polygon":
    case "border":
    default:
      return (): ColorResult => palette[0];
  }
};
