import siac from "@assets/logos/siac.png";
import nasa from "@assets/logos/nasa.png";
import temple from "@assets/logos/temple.png";
import geobon from "@assets/logos/geobon.png";
import usaid from "@assets/logos/usaid.png";
import umed from "@assets/logos/umed.png";
import fondoParaLaVida from "@assets/logos/fondoParaLaVida.png";
import minAmbiente from "@assets/logos/minAmbiente.png";
import monitoreoAmazonia from "@assets/logos/monitoreoAmazonia.png";

export const collaboratorsIcons = {
  nasa: { img: nasa, url: "https://www.nasa.gov/" },
  temple: { img: temple, url: "https://www.temple.edu/" },
  siac: { img: siac, url: "http://www.siac.gov.co/" },
  geobon: { img: geobon, url: "https://geobon.org/" },
  usaid: { img: usaid, url: "https://www.usaid.gov/" },
  umed: { img: umed, url: "https://udemedellin.edu.co/" },
  minAmbiente: { img: minAmbiente, url: "https://www.minambiente.gov.co/" },
  fondoParaLaVida: {
    img: fondoParaLaVida,
    url: "https://www.minambiente.gov.co/fondo-para-la-vida/",
  },
  monitoreoAmazonia: {
    img: monitoreoAmazonia,
    url: "https://www.humboldt.org.co/noticias/fortalecer-los-territorios-de-la-amazonia-a-partir-del-monitoreo-comunitario-de-la-biodiversidad",
  },
} as const;
