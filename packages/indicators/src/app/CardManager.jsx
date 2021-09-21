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
        target={card.target}
        lastUpdate={card.lastUpdate}
        scale={card.scale}
        externalLink={card.externalLink}
      />
    ))}
  </Masonry>
);

CardManager.propTypes = {
  cardsData: PropTypes.arrayOf(Card).isRequired,
};

export default CardManager;
