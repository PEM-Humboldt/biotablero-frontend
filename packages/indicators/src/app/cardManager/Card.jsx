import React from 'react';
import PropTypes from 'prop-types';
import LinkIcon from './URLIcon';

const Card = ({ title, goal, period, scale, action, externalLink }) => (
  <div className="indicatorCard">
    <h1>
      {title}
      <span className="links">
        <a className="linkURL" href={externalLink} title="Ir al indicador">
          <LinkIcon fontSize={50} />
        </a>
        <a href={action} title="Abrir indicador">
          +
        </a>
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
  action: PropTypes.string.isRequired,
  externalLink: PropTypes.string.isRequired,
};

Card.defaultProps = {
  goal: '',
  period: '',
  scale: '',
};

export default Card;
