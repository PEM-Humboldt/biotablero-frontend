import { useEffect, useRef, useState } from "react";

import Masonry from "react-masonry-component";
import { Card } from "pages/indicators/app/cardManager/Card";
import { type ExpandedCardItem } from "pages/indicators/app/cardManager/ExpandedCard";

const masonryOptions = {
  transitionDuration: 0,
  itemSelector: ".indicatorCard",
  columnWidth: 360,
  horizontalOrder: true,
};

export function CardManager({ cardsData }: { cardsData: ExpandedCardItem[] }) {
  const [expanded, setExpanded] = useState<ExpandedCardItem | null>(null);
  const prevExpanded = useRef<ExpandedCardItem>();

  useEffect(() => {
    if (!prevExpanded || !expanded) {
      return;
    }

    prevExpanded.current = expanded;
  }, [expanded]);

  const isExpanded = (elem: ExpandedCardItem) => expanded?.id === elem.id;
  const wasExpanded = (elem: ExpandedCardItem) => {
    if (!prevExpanded.current) {
      return false;
    }

    return prevExpanded.current.id === elem.id;
  };
  const expandClickHandler = (cardData: ExpandedCardItem) => () => {
    if (isExpanded(cardData)) {
      setExpanded(null);
    } else {
      setExpanded(cardData);
    }
  };

  return (
    <>
      {/* @ts-expect-error react-masonry-component has no updated types*/}
      <Masonry options={masonryOptions} enableResizableChildren>
        {cardsData.map((card) => {
          return (
            <Card
              key={card.id}
              item={card}
              isExpanded={isExpanded(card)}
              wasExpanded={wasExpanded(card)}
              expandClick={expandClickHandler(card)}
            />
          );
        })}
      </Masonry>
    </>
  );
}
