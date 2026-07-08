import politicalSelection from "@assets/mapButtons/political.png";
import topographicSelection from "@assets/mapButtons/topography.png";
import satelitalSelection from "@assets/mapButtons/satelital.png";

import deforestationBtn from "@assets/mapButtons/deforestacion.png";
import forestBtn from "@assets/mapButtons/bosques.png";
import waterResourcesBtn from "@assets/mapButtons/fuentesHidricas.png";
import roadsBtn from "@assets/mapButtons/vias.png";

export const MAP_TILES = [
  {
    label: "Político",
    attribution:
      '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    uiThumbs: { button: politicalSelection, selection: satelitalSelection },
  },
  {
    label: "Topográfico",
    attribution:
      'Sources: Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), (c) OpenStreetMap contributors, and the GIS User Community | Powered by <a href="https://www.esri.com/">Esri</a>',
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    uiThumbs: { button: topographicSelection, selection: satelitalSelection },
  },
  {
    label: "Satelital",
    attribution:
      'Sources: Esri, Vantor, Earthstar Geographics, and the GIS User Community | Powered by <a href="https://www.esri.com/">Esri</a>',
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    uiThumbs: { button: satelitalSelection, selection: satelitalSelection },
  },
] as const;

export const MAP_LAYERS = [
  {
    label: "Páramos",
    attribution: "",
    url: "https://geoservicios.humboldt.org.co/geoserver/wms",
    layers: "Proyecto_fondo_adaptacion:Limites24Paramos_25K_2016",
    buttonBkg: deforestationBtn,
  },
  {
    label: "Cobertura boscosa",
    attribution: "",
    url: "https://geoservicios.humboldt.org.co/geoserver/ideam/wms",
    layers: "ideam:bnb_2024_v8",
    buttonBkg: forestBtn,
  },
  {
    label: "Humedales",
    url: "https://geoservicios.humboldt.org.co/geoserver/wms",
    attribution: "",
    layers:
      "Proyecto_fondo_adaptacion:Humedales_Continentales_Insulares_2015_Vector",
    buttonBkg: waterResourcesBtn,
  },
  {
    label: "Áreas protegidas",
    attribution: "",
    url: "https://mapas.parquesnacionales.gov.co/services/pnn/wms",
    layers: "pnn:runap",
    buttonBkg: roadsBtn,
  },
] as const;
