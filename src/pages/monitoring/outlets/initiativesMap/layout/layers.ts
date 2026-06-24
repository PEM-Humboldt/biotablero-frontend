import politicalSelection from "@assets/mapButtons/political.png";
import topographicSelection from "@assets/mapButtons/topography.png";
import satelitalSelection from "@assets/mapButtons/satelital.png";

import deforestationBtn from "@assets/mapButtons/deforestacion.png";
import forestBtn from "@assets/mapButtons/bosques.png";
import waterResourcesBtn from "@assets/mapButtons/fuentesHidricas.png";
import roadsBtn from "@assets/mapButtons/vias.png";

export const MAP_TILES = {
  0: {
    label: "Político",
    attribution:
      '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    uiThumbs: { button: politicalSelection, selection: satelitalSelection },
  },
  1: {
    label: "Topográfico",
    attribution:
      'Sources: Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), (c) OpenStreetMap contributors, and the GIS User Community | Powered by <a href="https://www.esri.com/">Esri</a>',
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    uiThumbs: { button: topographicSelection, selection: satelitalSelection },
  },
  2: {
    label: "Satelital",
    attribution:
      'Sources: Esri, Vantor, Earthstar Geographics, and the GIS User Community | Powered by <a href="https://www.esri.com/">Esri</a>',
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    uiThumbs: { button: satelitalSelection, selection: satelitalSelection },
  },
} as const;

export const MAP_LAYERS = {
  0: {
    label: "Deforestación",
    attribution: "",
    url: "",
    buttonBkg: deforestationBtn,
  },
  1: {
    label: "Bosques",
    attribution: "",
    url: "",
    buttonBkg: forestBtn,
  },
  2: {
    label: "Fuentes hídricas",
    attribution: "",
    url: "",
    buttonBkg: waterResourcesBtn,
  },
  3: {
    label: "Vías",
    attribution: "",
    url: "",
    buttonBkg: roadsBtn,
  },
};
