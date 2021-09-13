import React from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component';

import Card from './cardManager/Card';

const masonryOptions = {
  transitionDuration: 0,
};

const style = {
  fontSize: '26px !important',
};

const CardManager = ({ cardsData }) => (
  <Masonry options={masonryOptions} style={style}>
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
  cardsData: PropTypes.arrayOf.isRequired,
};

export default CardManager;
