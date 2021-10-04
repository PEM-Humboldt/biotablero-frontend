import React from 'react';
import Masonry from 'react-masonry-component';
import PropTypes from 'prop-types';

import Card from './cardManager/Card';

const masonryOptions = {
  transitionDuration: 0,
};

const CardManager = ({ cardsData }) => (
  <Masonry options={masonryOptions}>
    {cardsData.map((card) => (
      <Card
        key={card.key}
        title={card.title}
        target={card.target}
        lastUpdate={card.lastUpdate}
        scale={card.scale}
        externalLink={card.externalLink}
      />
    ))}
  </Masonry>
);

CardManager.propTypes = {
  cardsData: PropTypes.arrayOf(PropTypes.shape({ ...Card.propTypes })).isRequired,
};

export default CardManager;
