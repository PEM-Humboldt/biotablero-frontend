export const MAP_LAYERS = {
  0: {
    label: "Político",
    attribution:
      '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  1: {
    label: "Topográfico",
    attribution:
      '&copy; <a href="https://www.esri.com/">Esri</a> & contributors',
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  },
  2: {
    label: "Satelital",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
} as const;
