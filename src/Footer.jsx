/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import logohumboldt from './assets/img/logohumboldt.png';
import logosiac from './assets/img/logosiac.png';
import './assets/main.css';

const Footer = (
  {
    showLogos,
  },
) => (
  <footer>
    {
    (showLogos) ? (
      <div className="footerflex">
        <div>
          <a href="http://www.humboldt.org.co/es/">
            <img src={logohumboldt} alt="" />
          </a>
        </div>
        <div>
          <h4>
            Colaboradores
          </h4>
          <a href="http://www.siac.gov.co/siac.html">
            <img src={logosiac} alt="" />
          </a>
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
  </footer>
);

Footer.propTypes = {
  showLogos: PropTypes.bool,
};

Footer.defaultProps = {
  showLogos: false,
};

export default Footer;
