import React from 'react';
import PropTypes from 'prop-types';

import LinkIcon from './card/URLIcon';
import OpenIcon from '../../components/OpenIcon';

const Card = ({ title, target, lastUpdate, scale, externalLink }) => (
  <div className="indicatorCard">
    <div className="cardTitles">
      <h1>{title}</h1>
      <div className="links">
        <a className="linkURL" href={externalLink} title="Ir al enlace">
          <LinkIcon fontSize={19} />
        </a>
        <div
          className="expandIndicatorButton"
          onClick={() => {}}
          onKeyDown={() => {}}
          role="button"
          title="Abrir indicador"
          tabIndex={0}
        >
          <OpenIcon fontSize={19} color="#e84a60" />
        </div>
      </div>
    </div>
    <h2>{lastUpdate}</h2>
    <h3>OBJETIVO</h3>
    <h4>{target}</h4>
    <br />
    <h3>ESCALA</h3>
    <h4>{scale}</h4>
  </div>
);

Card.propTypes = {
  title: PropTypes.string,
  target: PropTypes.string,
  lastUpdate: PropTypes.string,
  scale: PropTypes.string,
  externalLink: PropTypes.string,
};

Card.defaultProps = {
  title: '',
  target: '',
  lastUpdate: '',
  scale: '',
  externalLink: '',
};

export default Card;
