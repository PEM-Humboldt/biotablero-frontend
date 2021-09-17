import React from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

import Card from './cardManager/Card';

const masonryOptions = {
  transitionDuration: 0,
};

const CardManager = ({ cardsData }) => (
  <>
    <div className="countD">
      {cardsData ? `${cardsData.length} indicadores` : 'No hay indicadores'}
    </div>
    <div className="countDIcon">
      <SaveAltIcon color="#e84a5f" />
    </div>
    <Masonry options={masonryOptions}>
      {cardsData.map((card) => (
        <Card
          key={card.id}
          indicator={card.title}
          title={card.title}
          goal={card.goal}
          period={card.period}
          scale={card.scale}
          externalLink={card.externalLink}
        />
      ))}
    </Masonry>
  </>
);

CardManager.propTypes = {
  cardsData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      goal: PropTypes.string,
      period: PropTypes.string,
      scale: PropTypes.string,
    })
  ),
};

CardManager.defaultProps = {
  cardsData: [],
};

export default CardManager;
