import logohumboldt from "images/logohumboldt.png";
import logoSiac from "images/logosiac.png";
import nasa from "images/nasa.png";
import temple from "images/temple.png";
import geobon from "images/geobonlogo.png";
import usaid from "images/usaidlogo.png";
import umed from "images/umed.png";

import type { Collaborators } from "core/types/layout";

export const collaboratorsData: {
  [key in Collaborators]: { img: string; url: string };
} = {
  nasa: { img: nasa, url: "https://www.nasa.gov/" },
  temple: { img: temple, url: "https://www.temple.edu/" },
  siac: { img: logoSiac, url: "http://www.siac.gov.co/" },
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
    img: logohumboldt,
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
