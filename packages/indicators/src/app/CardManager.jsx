import React, { useState } from 'react';
import Masonry from 'react-masonry-component';
import PropTypes from 'prop-types';

import Card from './cardManager/Card';
import ExpandedCard from './cardManager/ExpandedCard';

const masonryOptions = {
  transitionDuration: 0,
  itemSelector: '.indicatorCard',
  columnWidth: 360,
  horizontalOrder: true,
};

const CardManager = ({ cardsData }) => {
  const [expanded, setExpanded] = useState(null);

  const isExpanded = (elem) => expanded?.id === elem.id;

  const expandedItem = cardsData.find(isExpanded);
  return (
    <>
      <ExpandedCard item={expandedItem} expandClick={() => setExpanded(null)} />
      <Masonry options={masonryOptions} enableResizableChildren>
        {cardsData.map((card) => {
          if (!isExpanded(card)) {
            return <Card key={card.id} item={card} expandClick={() => setExpanded(card)} />;
          }
          return '';
        })}
      </Masonry>
    </>
  );
};

CardManager.propTypes = {
  cardsData: PropTypes.arrayOf(ExpandedCard.propTypes.item).isRequired,
};

export default CardManager;
