import humboldt from "@assets/logos/humboldt.png";
import siac from "@assets/logos/siac.png";
import nasa from "@assets/logos/nasa.png";
import temple from "@assets/logos/temple.png";
import geobon from "@assets/logos/geobon.png";
import usaid from "@assets/logos/usaid.png";
import umed from "@assets/logos/umed.png";

import type { Collaborators } from "core/types/layout";

export const collaboratorsData: {
  [key in Collaborators]: { img: string; url: string };
} = {
  nasa: { img: nasa, url: "https://www.nasa.gov/" },
  temple: { img: temple, url: "https://www.temple.edu/" },
  siac: { img: siac, url: "http://www.siac.gov.co/" },
  geobon: { img: geobon, url: "https://geobon.org/" },
  usaid: { img: usaid, url: "https://www.usaid.gov/" },
  umed: { img: umed, url: "https://udemedellin.edu.co/" },
};

export const footerInfo = {
  uiTxt: {
    links: {
      citation: "Citese",
      contact: "Contacto",
    },
    collaboratorsTitle: "Colaboradores",
  },
  IAVH: {
    img: humboldt,
    name: "Alexander von Humboldt",
    tag: "Instituto de Investigación de Recursos Biológicos",
    contact: "biotablero@humboldt.org.co",
    url: "http://www.humboldt.org.co/es/",
    linkAlt: "Ir al sitio web",
  },
  citationClipboard:
    "Instituto de Investigación de Recursos Biológicos Alexander von Humboldt. (2019). BioTablero, cifras e indicadores sobre biodiversidad. biotablero.humboldt.org",
  citationTooltip:
    'La siguiente citación será copiada al portapapeles: "Instituto de Investigación de Recursos Biológicos Alexander von Humboldt. (2019). BioTablero, cifras e indicadores sobre biodiversidad. biotablero.humboldt.org"',
};
