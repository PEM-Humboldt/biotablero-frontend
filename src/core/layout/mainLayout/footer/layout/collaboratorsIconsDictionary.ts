import siac from "@assets/logos/siac.png";
import nasa from "@assets/logos/nasa.png";
import temple from "@assets/logos/temple.png";
import geobon from "@assets/logos/geobon.png";
import usaid from "@assets/logos/usaid.png";
import umed from "@assets/logos/umed.png";

export const collaboratorsIconsDictionary = {
  nasa: { img: nasa, url: "https://www.nasa.gov/" },
  temple: { img: temple, url: "https://www.temple.edu/" },
  siac: { img: siac, url: "http://www.siac.gov.co/" },
  geobon: { img: geobon, url: "https://geobon.org/" },
  usaid: { img: usaid, url: "https://www.usaid.gov/" },
  umed: { img: umed, url: "https://udemedellin.edu.co/" },
} as const;
