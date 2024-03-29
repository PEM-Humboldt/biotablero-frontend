import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import LinkIcon from './URLIcon';
import PlusIcon from '../../components/PlusIcon';
import ExpandedCard from './ExpandedCard';

const Card = (props) => {
  const { item, expandClick, isExpanded, wasExpanded } = props;

  if (isExpanded) {
    return <ExpandedCard item={item} expandClick={expandClick} />;
  }

  const { id, title, target, lastUpdate, scale, externalLink } = item;
  const cardRef = useRef();
  useEffect(() => {
    if (wasExpanded) {
      cardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [wasExpanded]);

  return (
    <div id={id} className={`indicatorCard${wasExpanded ? ' no-transition' : ''}`} ref={cardRef}>
      <div className="cardTitles">
        <h1>{title}</h1>
        <div className="links">
          {externalLink && (
            <a
              className="linkURL"
              href={externalLink}
              title="Ir al enlace"
              target="_blank"
              rel="noreferrer"
            >
              <LinkIcon fontSize={19} />
            </a>
          )}
          <div
            className="expandIndicatorButton"
            onClick={expandClick}
            onKeyDown={() => {}}
            role="button"
            title="Abrir indicador"
            tabIndex={0}
          >
            <PlusIcon fontSize={30} color="#e84a60" />
          </div>
        </div>
      </div>
      <h2>{lastUpdate}</h2>
      <h3>OBJETIVO</h3>
      <h4>{target}</h4>
      <h3>ESCALA</h3>
      <h4>{scale.join(', ')}</h4>
    </div>
  );
};

Card.propTypes = {
  item: ExpandedCard.propTypes.item.isRequired,
  expandClick: PropTypes.func,
  isExpanded: PropTypes.bool.isRequired,
  wasExpanded: PropTypes.bool.isRequired,
};

Card.defaultProps = {
  expandClick: () => {},
};

export default Card;
