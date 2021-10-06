import React from 'react';
import PropTypes from 'prop-types';

import LinkIcon from './URLIcon';
import OpenIcon from '../../components/OpenIcon';

const Card = (props) => {
  const {
    item: { id, title, target, lastUpdate, scale, externalLink },
    expandClick,
  } = props;

  return (
    <div id={id} className="indicatorCard">
      <div className="cardTitles">
        <h1>{title}</h1>
        <div className="links">
          <a className="linkURL" href={externalLink} title="Ir al enlace">
            <LinkIcon fontSize={19} />
          </a>
          <div
            className="expandIndicatorButton"
            onClick={expandClick}
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
      <h3>OBJETIVO - {id}</h3>
      <h4>{target}</h4>
      <br />
      <h3>ESCALA</h3>
      <h4>{scale}</h4>
    </div>
  );
};

Card.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    target: PropTypes.string,
    lastUpdate: PropTypes.string,
    scale: PropTypes.string,
    externalLink: PropTypes.string,
  }).isRequired,
  expandClick: PropTypes.func,
};

Card.defaultProps = {
  expandClick: () => {},
};

export default Card;
