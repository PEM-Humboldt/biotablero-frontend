import React from 'react';
import PropTypes from 'prop-types';

import LinkIcon from './URLIcon';
import OpenIcon from '../../components/OpenIcon';
import ExpandedCard from './ExpandedCard';

const Card = (props) => {
  const { item, expandClick, isExpanded } = props;

  if (isExpanded) {
    return <ExpandedCard item={item} expandClick={expandClick} />;
  }

  const { id, title, target, lastUpdate, scale, externalLink } = item;

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
  item: ExpandedCard.propTypes.item.isRequired,
  expandClick: PropTypes.func,
  isExpanded: PropTypes.bool.isRequired,
};

Card.defaultProps = {
  expandClick: () => {},
};

export default Card;
