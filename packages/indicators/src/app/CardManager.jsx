import React from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component';

import Card from './cardManager/Card';

const masonryOptions = {
  transitionDuration: 0,
};

const CardManager = ({ cardsData }) => (
  <Masonry options={masonryOptions}>
    {cardsData.map((card) => (
      <Card
        key={card.title}
        indicator={card.title}
        title={card.title}
        goal={card.goal}
        period={card.period}
        scale={card.scale}
        action="./Indicadores"
        externalLink={card.externalLink}
      />
    ))}
  </Masonry>
);

CardManager.propTypes = {
  cardsData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      goal: PropTypes.string,
      period: PropTypes.string,
      scale: PropTypes.string,
      action: PropTypes.string,
    })
  ),
};

CardManager.defaultProps = {
  cardsData: [],
};

export default CardManager;
