export interface shapeLayer {
  id: string;
  paneLevel: number | null;
  json: Object | undefined;
  active: boolean;
  onEachFeature?: Function;
  layerStyle?: Object;
}

export interface connectivityFeaturePropierties {
  area: number;
  dpc_cat: string;
  id: string;
  name: string;
  value: number;
}
