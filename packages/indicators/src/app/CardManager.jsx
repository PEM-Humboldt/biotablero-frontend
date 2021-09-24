import React from 'react';
import Masonry from 'react-masonry-component';

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
  ...Card.propTypes,
};

export default CardManager;
