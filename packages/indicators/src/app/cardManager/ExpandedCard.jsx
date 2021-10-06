import React from 'react';
import PropTypes from 'prop-types';

import LinkIcon from './URLIcon';
import CloseIcon from '../../components/CloseIcon';

const Card = ({ item, expandClick }) => {
  if (!item) {
    return <div className="expandedCard noshow" />;
  }
  const {
    id,
    title,
    target,
    lastUpdate,
    scale,
    externalLink,
    goals = [],
    periodicity = '',
    use = '',
    description = '',
    requirements = '',
    ebv = [],
    source = '',
  } = item;

  return (
    <div className="expandedCard">
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
            title="Cerrar indicador"
            tabIndex={0}
          >
            <CloseIcon fontSize={19} color="#e84a60" />
          </div>
        </div>
      </div>
      <h2>{lastUpdate}</h2>
      <h3>OBJETIVO - {id}</h3>
      <h4>{target}</h4>
      <br />
      <h3>ESCALA</h3>
      <h4>{scale}</h4>
      <h3>METAS</h3>
      <h4>{goals.join('\n')}</h4>
      <h3>PERIODICIDAD</h3>
      <h4>{periodicity}</h4>
      <h3>CONTEXTO DE USO</h3>
      <h4>{use}</h4>
      <h3>DESCRIPCIÓN DEL INDICADOR</h3>
      <h4> {description} </h4>
      <h3>REQUERIMIENTO DE INFORMACIÓN PARA SI CÁLCULO</h3>
      <h4>{requirements}</h4>
      <br />
      <h4>
        <b>VEBs:</b> {ebv.join(',')}
      </h4>
      <h3>FUENTE</h3>
      <h4>{source}</h4>
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
    goals: PropTypes.arrayOf(PropTypes.string),
    periodicity: PropTypes.string,
    use: PropTypes.string,
    description: PropTypes.string,
    ebv: PropTypes.arrayOf(PropTypes.string),
    source: PropTypes.string,
    requirements: PropTypes.string,

    externalLink: PropTypes.string,
  }),
  expandClick: PropTypes.func,
};

Card.defaultProps = {
  item: null,
  expandClick: () => {},
};

export default Card;
