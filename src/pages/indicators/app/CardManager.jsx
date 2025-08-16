import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import Masonry from "react-masonry-component";
import Card from "pages/indicators/app/cardManager/Card";

const masonryOptions = {
  transitionDuration: 0,
  itemSelector: ".indicatorCard",
  columnWidth: 360,
  horizontalOrder: true,
};

const CardManager = ({ cardsData }) => {
  const [expanded, setExpanded] = useState(null);
  const prevExpanded = useRef();

  useEffect(() => {
    prevExpanded.current = expanded;
  }, [expanded]);

  const isExpanded = (elem) => expanded?.id === elem.id;
  const wasExpanded = (elem) => prevExpanded?.current?.id === elem.id;

  return (
    <Masonry options={masonryOptions} enableResizableChildren>
      {cardsData.map((card) => {
        return (
          <Card
            key={card.id}
            item={card}
            isExpanded={isExpanded(card)}
            wasExpanded={wasExpanded(card)}
            expandClick={() => {
              if (isExpanded(card)) setExpanded(null);
              else setExpanded(card);
            }}
          />
        );
      })}
    </Masonry>
  );
};

CardManager.propTypes = {
  cardsData: PropTypes.arrayOf(Card.propTypes.item).isRequired,
};

export default CardManager;
