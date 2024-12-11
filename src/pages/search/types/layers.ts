export interface shapeLayer {
  id: string;
  paneLevel: number | null;
  json: Object | undefined;
  active: boolean;
  onEachFeature?: Function;
  layerStyle?: Object;
}
