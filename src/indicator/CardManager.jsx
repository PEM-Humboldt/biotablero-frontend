/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component';
import Card from './Card';

const masonryOptions = {
  transitionDuration: 0,
};

const CardManager = ({
  cardsData,
}) => (
  <Masonry
    options={masonryOptions}
  >
    {cardsData.map((card) => (
      <Card
        key={card.title}
        title={card.title}
        description={card.description}
        period={card.period}
        action="./Indicadores"
      />
    ))}
  </Masonry>
);

CardManager.propTypes = {
  cardsData: PropTypes.array.isRequired,
};

export default CardManager;
