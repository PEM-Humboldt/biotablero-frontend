import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import LinkIcon from './URLIcon';
import CloseIcon from '../../components/CloseIcon';

const ExpandedCard = ({ item, expandClick }) => {
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
  const cardRef = useRef();
  useEffect(() => {
    cardRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div id={id} className="indicatorCard expandedCard" ref={cardRef}>
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
      <div className="spliter">
        <div className="colsm">
          {target && (
            <>
              <h3>OBJETIVO</h3>
              <h4>{target}</h4>
            </>
          )}
          {scale.length > 0 && (
            <>
              <h3>ESCALA</h3>
              <h4>{scale.join(', ')}</h4>
            </>
          )}
          {goals.length > 0 && (
            <>
              <h3>METAS</h3>
              <h4>{goals.join('\n')}</h4>
            </>
          )}
          {periodicity && (
            <>
              <h3>PERIODICIDAD</h3>
              <h4>{periodicity}</h4>
            </>
          )}
        </div>
        <div className="colbg">
          {description && (
            <>
              <h3>DESCRIPCIÓN DEL INDICADOR</h3>
              <h4> {description} </h4>
            </>
          )}
          {requirements && (
            <>
              <h3>REQUERIMIENTO DE INFORMACIÓN PARA SU CÁLCULO</h3>
              <h4>{requirements}</h4>
            </>
          )}
          {ebv.length > 0 && (
            <>
              <br />
              <h4>
                <b>VEBs:</b> {ebv.join(',')}
              </h4>
            </>
          )}
          {use && (
            <>
              <h3>CONTEXTO DE USO</h3>
              <h4>{use}</h4>
            </>
          )}
          {source && (
            <>
              <h3>FUENTE</h3>
              <h4>{source}</h4>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ExpandedCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    target: PropTypes.string,
    lastUpdate: PropTypes.string,
    scale: PropTypes.arrayOf(PropTypes.string),
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

ExpandedCard.defaultProps = {
  item: {
    title: '',
    target: '',
    lastUpdate: '',
    scale: [],
    goals: [],
    periodicity: '',
    use: '',
    description: '',
    ebv: [],
    source: '',
    requirements: '',
    externalLink: '',
  },
  expandClick: () => {},
};

export default ExpandedCard;
