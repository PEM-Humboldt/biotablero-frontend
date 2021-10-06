import React, { useState } from 'react';
import Masonry from 'react-masonry-component';
import PropTypes from 'prop-types';

import Card from './cardManager/Card';

const masonryOptions = {
  transitionDuration: 0,
  itemSelector: '.indicatorCard',
  columnWidth: 360,
  horizontalOrder: true,
};

const CardManager = ({ cardsData }) => {
  const [expanded, setExpanded] = useState(null);

  const isExpanded = (elem) => expanded?.id === elem.id;

  return (
    <>
      <Masonry options={masonryOptions} enableResizableChildren>
        {cardsData.map((card) => {
          return (
            <Card
              key={card.id}
              item={card}
              isExpanded={isExpanded(card)}
              expandClick={() => {
                if (isExpanded(card)) setExpanded(null);
                else setExpanded(card);
              }}
            />
          );
        })}
      </Masonry>
    </>
  );
};

CardManager.propTypes = {
  cardsData: PropTypes.arrayOf(Card.propTypes.item).isRequired,
};

export default CardManager;
