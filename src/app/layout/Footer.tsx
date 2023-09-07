import React from 'react';
import logohumboldt from 'images/logohumboldt.png';
import logoSiac from 'images/logosiac.png';
import nasa from 'images/nasa.png';
import temple from 'images/temple.png';
import geobon from 'images/geobonlogo.png';
import usaid from 'images/usaidlogo.png';
import umed from 'images/umed.png';

interface ImgLogos {
  nasa: {
    img: string;
    url: string;
  };
  temple: {
    img: string;
    url: string;
  };
siac: {
    img: string;
    url: string;
  };
geobon: {
    img: string;
    url: string;
  };
usaid: {
    img: string;
    url: string;
  };
umed: {
    img: string;
    url: string;
  };
}

interface NameLogo{
  default: string[];
  monitoreo: string[];
} 

const logosData: ImgLogos = {
  nasa: { img: nasa, url: 'https://www.nasa.gov/' },
  temple: { img: temple, url: 'https://www.temple.edu/' },
  siac: { img: logoSiac, url: 'http://www.siac.gov.co/siac.html' },
  geobon: { img: geobon, url: 'https://geobon.org/' },
  usaid: { img: usaid, url: 'https://www.usaid.gov/' },
  umed: { img: umed, url: 'https://udemedellin.edu.co/' },
};

const logoSet: NameLogo = {
  default: ['nasa', 'temple', 'siac'],
  monitoreo: ['usaid', 'geobon', 'umed', 'temple'],
};

interface Logo {
  logosId: string
} 

const Footer: React.FC<Logo> = (
  {
    logosId,
  },
) => (
  <footer>
    {
    (logosId && logoSet[logosId as keyof typeof logoSet]) ? (
      <div className="footerflex">
        <div>
          <a href="http://www.humboldt.org.co/es/">
            <img src={logohumboldt} alt="" />
          </a>
        </div>
        <div className="colaboradores">
          <h4>
            Colaboradores
          </h4>
          {logoSet[logosId as keyof typeof logoSet].map((name) => {
            if (!logosData[name as keyof typeof logosData]) return null;
            return (
              <a href={logosData[name as keyof typeof logosData].url} target="_blank" rel="noopener noreferrer" key={name}>
                <img src={logosData[name as keyof typeof logosData].img} alt="" />
              </a>
            );
          })}
        </div>
      </div>
    ) : ('')
    }
    <div className="footersm" style={{position:"relative"}}>
      <a href="http://www.humboldt.org.co/es/">
        Instituto de Investigación de Recursos Biológicos
        <br />
        <b>
          Alexander von Humboldt
        </b>
      </a>
      <div className="footersm quoteStyle">
        <h3>
          <button 
            title='La siguiente citación será copiada al portapapeles: "Instituto de Investigación de Recursos Biológicos Alexander von Humboldt. (2019). BioTablero, cifras e indicadores sobre biodiversidad. biotablero.humboldt.org"' 
            className="footerTooltip" 
            onClick={() => {
              navigator.clipboard.writeText("Instituto de Investigación de Recursos Biológicos Alexander von Humboldt. (2019). BioTablero, cifras e indicadores sobre biodiversidad. biotablero.humboldt.org");
            }}>
              Cítese
          </button>
        </h3>
        <h3>
          <a href="mailto:mlondono@humboldt.org.co">
            Contacto
          </a>
        </h3>
      </div>
    </div>
  </footer>
);

export default Footer;
