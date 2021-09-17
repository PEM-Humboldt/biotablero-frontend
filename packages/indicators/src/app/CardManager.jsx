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
        key={card.id}
        indicator={card.title}
        title={card.title}
        goal={card.goal}
        lastUpdate={card.lastUpdate}
        scale={card.scale}
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
      lastUpdate: PropTypes.string,
      scale: PropTypes.string,
    })
  ),
};

CardManager.defaultProps = {
  cardsData: [],
};

export default CardManager;
