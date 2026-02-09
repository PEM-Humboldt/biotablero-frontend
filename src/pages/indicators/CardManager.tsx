import { useEffect, useRef, useState } from "react";

import Masonry from "react-masonry-component";
import { Card } from "pages/indicators/cardManager/Card";
import { type CardItem } from "pages/indicators/cardManager/ExpandedCard";
import { SidebarInset } from "@ui/shadCN/component/sidebar";

const masonryOptions = {
  transitionDuration: 0,
  itemSelector: ".indicatorCard",
  columnWidth: 360,
  horizontalOrder: true,
};

export function CardManager({
  cardsData,
  isLoading,
}: {
  isLoading: boolean;
  cardsData: CardItem[];
}) {
  const [expanded, setExpanded] = useState<CardItem | null>(null);
  const prevExpanded = useRef<CardItem>();

  useEffect(() => {
    if (!prevExpanded || !expanded) {
      return;
    }

    prevExpanded.current = expanded;
  }, [expanded]);

  const isExpanded = (elem: CardItem) => expanded?.id === elem.id;

  const wasExpanded = (elem: CardItem) => {
    if (!prevExpanded.current) {
      return false;
    }

    return prevExpanded.current.id === elem.id;
  };

  const expandClickHandler = (cardData: CardItem) => () => {
    if (isExpanded(cardData)) {
      setExpanded(null);
    } else {
      setExpanded(cardData);
    }
  };

  const hasCards = cardsData.length > 0;

  return (
    <SidebarInset>
      <header className="flex gap-2 p-2 items-center text-foreground text-xl text-center font-normal">
        {isLoading && "Cargando información..."}
        {!isLoading && hasCards
          ? `${cardsData.length} indicadores`
          : "No hay indicadores"}
      </header>
      {hasCards && (
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
      )}
    </SidebarInset>
  );
}
