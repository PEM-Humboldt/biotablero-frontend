export interface GapMetricSerie {
  id: number | string;
  bin_edges: number[];
  histogram: number[];
}

export type SpeciesGroupKey =
  | "all"
  | "mammals"
  | "birds"
  | "reptiles"
  | "amphibians"
  | "fish"
  | "plants";

export const speciesGroupOptions: Array<{
  value: SpeciesGroupKey;
  label: string;
}> = [
  { value: "all", label: "Todos los grupos" },
  { value: "mammals", label: "Mamiferos" },
  { value: "birds", label: "Aves" },
  { value: "reptiles", label: "Reptiles" },
  { value: "amphibians", label: "Anfibios" },
  { value: "fish", label: "Peces" },
  { value: "plants", label: "Plantas" },
];

const E = [
  0.0, 0.05, 0.1, 0.15000000000000002, 0.2, 0.25, 0.30000000000000004,
  0.35000000000000003, 0.4, 0.45, 0.5, 0.55, 0.6000000000000001, 0.65,
  0.7000000000000001, 0.75, 0.8, 0.8500000000000001, 0.9, 0.9500000000000001,
  1.0,
];

export const gapMockByGroup: Record<SpeciesGroupKey, GapMetricSerie[]> = {
  all: [
    {
      id: 2019,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 1, 7, 25, 125, 360, 790, 560, 360, 1480, 5750, 8350,
        760, 2, 0,
      ],
    },
    {
      id: 2021,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 1, 3, 16, 52, 300, 870, 1750, 1210, 760, 3090, 12150,
        17750, 1610, 4, 1,
      ],
    },
    {
      id: 2023,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 1, 4, 24, 70, 515, 1460, 2910, 1980, 1240, 5000, 19400,
        28300, 2580, 6, 1,
      ],
    },
    {
      id: 2025,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 2, 6, 31, 88, 640, 1810, 3601, 2470, 1523, 6205, 24110,
        35200, 3200, 7, 1,
      ],
    },
  ],
  mammals: [
    {
      id: 2019,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 0, 3, 14, 49, 158, 149, 110, 132, 242, 939, 1248, 278,
        0, 0,
      ],
    },
    {
      id: 2021,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 0, 4, 19, 160, 520, 1198, 826, 500, 2047, 8202, 11896,
        1032, 0, 0,
      ],
    },
    {
      id: 2023,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 1, 8, 30, 194, 573, 1160, 784, 509, 2157, 8530, 12114,
        1128, 1, 0,
      ],
    },
    {
      id: 2025,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 1, 2, 12, 34, 234, 649, 1287, 895, 558, 2271, 8772,
        12720, 1239, 3, 0,
      ],
    },
  ],
  birds: [
    {
      id: 2019,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 0, 2, 11, 38, 119, 116, 87, 106, 191, 752, 1011, 216,
        0, 0,
      ],
    },
    {
      id: 2021,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 0, 3, 15, 124, 400, 959, 651, 393, 1582, 6387, 9316,
        766, 0, 0,
      ],
    },
    {
      id: 2023,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 1, 6, 23, 151, 451, 920, 620, 401, 1653, 6572, 9497,
        816, 1, 0,
      ],
    },
    {
      id: 2025,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 1, 2, 9, 26, 182, 508, 1017, 703, 439, 1738, 6750, 9856,
        896, 2, 0,
      ],
    },
  ],
  reptiles: [
    {
      id: 2019,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 0, 1, 5, 17, 54, 53, 38, 46, 81, 317, 428, 92, 0, 0,
      ],
    },
    {
      id: 2021,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 0, 1, 6, 53, 172, 410, 277, 168, 670, 2693, 3960, 326,
        0, 0,
      ],
    },
    {
      id: 2023,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 0, 3, 9, 63, 192, 394, 264, 169, 706, 2797, 4090, 349,
        0, 0,
      ],
    },
    {
      id: 2025,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 1, 4, 11, 77, 217, 432, 297, 185, 744, 2889, 4210,
        382, 1, 0,
      ],
    },
  ],
  amphibians: [
    {
      id: 2019,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 0, 1, 3, 11, 35, 34, 24, 30, 52, 211, 277, 58, 0, 0,
      ],
    },
    {
      id: 2021,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 0, 1, 4, 35, 115, 274, 184, 111, 456, 1828, 2693, 219,
        0, 0,
      ],
    },
    {
      id: 2023,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 0, 2, 6, 42, 129, 263, 178, 114, 476, 1884, 2764, 234,
        0, 0,
      ],
    },
    {
      id: 2025,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 1, 3, 7, 51, 145, 290, 199, 124, 503, 1944, 2836, 256,
        1, 0,
      ],
    },
  ],
  fish: [
    {
      id: 2019,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 0, 2, 8, 28, 88, 85, 62, 74, 129, 505, 680, 144, 0, 0,
      ],
    },
    {
      id: 2021,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 0, 2, 10, 89, 288, 686, 460, 279, 1134, 4540, 6680,
        546, 0, 0,
      ],
    },
    {
      id: 2023,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 1, 4, 16, 106, 321, 656, 442, 283, 1180, 4665, 6824,
        582, 1, 0,
      ],
    },
    {
      id: 2025,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 1, 6, 18, 128, 362, 722, 496, 308, 1245, 4835, 7032,
        637, 1, 0,
      ],
    },
  ],
  plants: [
    {
      id: 2019,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 1, 4, 18, 62, 194, 190, 137, 168, 294, 1188, 1560,
        328, 0, 0,
      ],
    },
    {
      id: 2021,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 0, 1, 5, 23, 197, 645, 1540, 1036, 624, 2575, 10389,
        15286, 1240, 0, 0,
      ],
    },
    {
      id: 2023,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 1, 2, 10, 35, 236, 716, 1479, 989, 633, 2683, 10610,
        15518, 1322, 1, 0,
      ],
    },
    {
      id: 2025,
      bin_edges: E,
      histogram: [
        0, 0, 0, 0, 0, 1, 3, 14, 40, 287, 814, 1619, 1111, 687, 2802, 10895,
        15890, 1440, 3, 0,
      ],
    },
  ],
};

export const gapMockResponse: GapMetricSerie[] = gapMockByGroup.all;
