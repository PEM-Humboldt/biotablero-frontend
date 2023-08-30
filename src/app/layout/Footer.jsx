import React, {useState} from 'react';
import PropTypes from 'prop-types';
import logohumboldt from 'images/logohumboldt.png';
import logoSiac from 'images/logosiac.png';
import nasa from 'images/nasa.png';
import temple from 'images/temple.png';
import geobon from 'images/geobonlogo.png';
import usaid from 'images/usaidlogo.png';
import umed from 'images/umed.png';
import {Modal, Button, Box} from '@mui/material';
import {makeStyles} from '@mui/styles';

const estilo = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
}
const boton = {
  color: "red",
  fontWeight: "600"
}

const logosData = {
  nasa: { img: nasa, url: 'https://www.nasa.gov/' },
  temple: { img: temple, url: 'https://www.temple.edu/' },
  siac: { img: logoSiac, url: 'http://www.siac.gov.co/siac.html' },
  geobon: { img: geobon, url: 'https://geobon.org/' },
  usaid: { img: usaid, url: 'https://www.usaid.gov/' },
  umed: { img: umed, url: 'https://udemedellin.edu.co/' },
};

const logoSet = {
  default: ['nasa', 'temple', 'siac'],
  monitoreo: ['usaid', 'geobon', 'umed', 'temple'],
};

const Footer = (
  {
    logosId,
  },
) => {

  const [modal, setModal]=useState(false);

  const abrirCerrrarModal = () => {
    setModal(!modal);
  }

  return(
  <footer>
    <Modal
    open={modal}
    onClose={abrirCerrrarModal}
    >
      <Box sx={estilo}>
      <div align="center">
        <h2 color='#e84a5f'>Citación copiada al portapapeles</h2>
      </div>
      <div align="right">
        <Button onClick={() => abrirCerrrarModal()}> <p style={boton}>Aceptar</p> </Button>
      </div>
      </Box>
    </Modal>
    {
    (logosId && logoSet[logosId]) ? (
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
          {logoSet[logosId].map((name) => {
            if (!logosData[name]) return null;
            return (
              <a href={logosData[name].url} target="_blank" rel="noopener noreferrer" key={name}>
                <img src={logosData[name].img} alt="" />
              </a>
            );
          })}
        </div>
      </div>
    ) : ('')
    }
    <div className="footersm" position="relative">
      <a href="http://www.humboldt.org.co/es/">
        Instituto de Investigación de Recursos Biológicos
        <br />
        <b>
          Alexander von Humboldt
        </b>
      </a>
      <h3>
        <a href="mailto:mlondono@humboldt.org.co">
          Contacto
        </a>
      </h3>
    </div>
    {
      (logosId && logoSet[logosId]) ? (
        <div className="footersm"> 
        <h3 style={{position: "absolute", top: "1181px", right: "100px"}}> 
          <a  href="#" onClick={() => {
            navigator.clipboard.writeText
              ("Instituto de Investigación de Recursos Biológicos Alexander von Humboldt. (2019). BioTablero, cifras e indicadores sobre biodiversidad. biotablero.humboldt.org");
              abrirCerrrarModal();
          }}>
             Cítese
          </a>
        </h3> 
      </div> ) : ("")
    }
  </footer>
  );
};

Footer.propTypes = {
  logosId: PropTypes.string,
};

Footer.defaultProps = {
  logosId: null,
};

export default Footer;
