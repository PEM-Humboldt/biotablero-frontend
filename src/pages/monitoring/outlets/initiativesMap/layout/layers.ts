import politicalSelection from "@assets/mapButtons/political.png";
import topographicSelection from "@assets/mapButtons/topography.png";
import satelitalSelection from "@assets/mapButtons/satelital.png";

import paramos from "@assets/mapButtons/paramo.png";
import forest from "@assets/mapButtons/forest.png";
import wetland from "@assets/mapButtons/wetland.png";
import protectedAreas from "@assets/mapButtons/protectedAreas.png";
import comunitaryCouncil from "@assets/mapButtons/comunitaryCouncil.png";
import indigenousLand from "@assets/mapButtons/indigenousLand.png";
import farmersReserve from "@assets/mapButtons/farmersReserve.png";

export const MAP_TILES: {
  label: string;
  attribution: string;
  url: string;
  uiThumbs: { button: string; selection: string };
}[] = [
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
      '&copy; 2012 Esri | Powered by <a href="https://www.esri.com/">Esri</a>',
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
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

export const MAP_LAYERS: {
  label: string;
  attribution: string;
  url: string;
  layers: string;
  buttonBkg: string;
}[] = [
  {
    label: "Páramos",
    attribution: "",
    url: "https://geoservicios.humboldt.org.co/geoserver/wms",
    layers: "Proyecto_fondo_adaptacion:Limites24Paramos_25K_2016",
    buttonBkg: paramos,
  },
  {
    label: "Cobertura boscosa",
    attribution: "",
    url: "https://geoservicios.humboldt.org.co/geoserver/ideam/wms",
    layers: "ideam:bnb_2024_v8",
    buttonBkg: forest,
  },
  {
    label: "Humedales",
    url: "https://geoservicios.humboldt.org.co/geoserver/wms",
    attribution: "",
    layers:
      "Proyecto_fondo_adaptacion:Humedales_Continentales_Insulares_2015_Vector",
    buttonBkg: wetland,
  },
  {
    label: "Áreas protegidas",
    attribution: "",
    url: "https://mapas.parquesnacionales.gov.co/services/pnn/wms",
    layers: "pnn:runap",
    buttonBkg: protectedAreas,
  },
  {
    label: "Consejo Comunitario Titulado",
    attribution: "",
    url: "https://geoservicios.humboldt.org.co/geoserver/wms",
    layers: "ant:Consejo comunitario titulado",
    buttonBkg: comunitaryCouncil,
  },
  {
    label: "Resguardo indígena formalizado",
    attribution: "",
    url: "https://geoservicios.humboldt.org.co/geoserver/wms",
    layers: "ant:Resguardo indígena formalizado",
    buttonBkg: indigenousLand,
  },
  {
    label: "Zona de reserva campesina constituida",
    attribution: "",
    url: "https://geoservicios.humboldt.org.co/geoserver/wms",
    layers: "ant:Zona de reserva campesina constituida",
    buttonBkg: farmersReserve,
  },
];
