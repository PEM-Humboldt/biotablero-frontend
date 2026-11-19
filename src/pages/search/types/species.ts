// GAP

export type GapData = {
  id: string | number;
  frequency: number[];
  bin_edges: number[];
};

export type GapSerieData = { id: string; data: { x: number; y: number }[] };
