import React from "react";
import logohumboldt from "images/logohumboldt.png";
import logoSiac from "images/logosiac.png";
import nasa from "images/nasa.png";
import temple from "images/temple.png";
import geobon from "images/geobonlogo.png";
import usaid from "images/usaidlogo.png";
import umed from "images/umed.png";

import { KEYS, LogosConfig } from "types/layoutTypes";

type LogosImg = {
  [key in KEYS]: { img: string; url: string };
};

const logosData: LogosImg = {
  nasa: { img: nasa, url: "https://www.nasa.gov/" },
  temple: { img: temple, url: "https://www.temple.edu/" },
  siac: { img: logoSiac, url: "http://www.siac.gov.co/" },
  geobon: { img: geobon, url: "https://geobon.org/" },
  usaid: { img: usaid, url: "https://www.usaid.gov/" },
  umed: { img: umed, url: "https://udemedellin.edu.co/" },
};

const logoSet: LogosConfig = {
  default: ["nasa", "temple", "siac"],
  monitoreo: ["usaid", "geobon", "umed", "temple"],
};

interface FooterProps {
  logosId: keyof LogosConfig | null;
}
const Footer: React.FC<FooterProps> = ({ logosId }) => (
  <footer className="footerflex">
    <div className="institutoDiv">
      {(logosId === "default" || logosId === "monitoreo") && (
        <a href="http://www.humboldt.org.co/es/">
          <img src={logohumboldt} alt="Instituto Humboldt" />
        </a>
      )}
      <div>
        Instituto de Investigación de Recursos Biológicos <br />
        <b>Alexander von Humboldt</b>
      </div>
    </div>
    <div className="colaboradoresDiv">
      <div className="colaboradores">
        {logosId && (logosId === "default" || logosId === "monitoreo") && (
          <span>Colaboradores</span>
        )}
        {logosId && logoSet[logosId] ? (
          logoSet[logosId].map(
            (name) =>
              (logosId === "default" || logosId === "monitoreo") && (
                <a
                  href={logosData[name].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={name}
                >
                  <img src={logosData[name].img} alt={name} />
                </a>
              )
          )
        ) : logosId && (logosId === "default" || logosId === "monitoreo") ? (
          <p>No se encontraron colaboradores para esta sección.</p>
        ) : null}
      </div>

      <div className="footersm quoteStyle">
        <h3>
          <button
            title='La siguiente citación será copiada al portapapeles: "Instituto de Investigación de Recursos Biológicos Alexander von Humboldt. (2019). BioTablero, cifras e indicadores sobre biodiversidad. biotablero.humboldt.org"'
            className="footerTooltip"
            onClick={() => {
              navigator.clipboard.writeText(
                "Instituto de Investigación de Recursos Biológicos Alexander von Humboldt. (2019). BioTablero, cifras e indicadores sobre biodiversidad. biotablero.humboldt.org"
              );
            }}
          >
            Cítese
          </button>
        </h3>
        <h3>
          <a href="mailto:biotablero@humboldt.org.co">Contacto</a>
        </h3>
      </div>
    </div>
  </footer>
);

export default Footer;
