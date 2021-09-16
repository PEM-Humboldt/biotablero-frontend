import React from 'react';
import PropTypes from 'prop-types';
import LinkIcon from './URLIcon';

const Card = ({ title, goal, period, scale, externalLink }) => (
  <div className="indicatorCard">
    <h1>
      {title}
      <span className="links">
        <a className="linkURL" href={externalLink} title="Ir al enlace">
          <LinkIcon fontSize={50} />
        </a>
        <div
          className="expandIndicatorButton"
          onClick={() => {}}
          onKeyDown={() => {}}
          role="button"
          title="Abrir indicador"
          tabIndex={0}
        >
          +
        </div>
      </span>
    </h1>
    <h2>{period}</h2>
    <h3>OBJETIVO</h3>
    <h4>{goal}</h4>
    <br />
    <h3>ESCALA</h3>
    <h4>{scale}</h4>
  </div>
);

Card.propTypes = {
  title: PropTypes.string.isRequired,
  goal: PropTypes.string,
  period: PropTypes.string,
  scale: PropTypes.string,
  externalLink: PropTypes.string.isRequired,
};

Card.defaultProps = {
  goal: '',
  period: '',
  scale: '',
};

export default Card;
