import { useEffect, useRef } from "react";

import { URLIcon } from "pages/indicators/app/cardManager/URLIcon";
import PlusIcon from "pages/indicators/components/PlusIcon";
import {
  ExpandedCard,
  type ExpandedCardProps,
} from "pages/indicators/app/cardManager/ExpandedCard";

interface CardProps extends ExpandedCardProps {
  isExpanded: boolean;
  wasExpanded: boolean;
}

export function Card({
  item,
  expandClick,
  isExpanded,
  wasExpanded,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { id, title, target, lastUpdate, scale, externalLink } = item;

  useEffect(() => {
    if (cardRef.current && wasExpanded) {
      cardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [wasExpanded]);

  if (isExpanded) {
    return <ExpandedCard item={item} expandClick={expandClick} />;
  }

  return (
    <div
      id={id}
      className={`indicatorCard${wasExpanded ? " no-transition" : ""}`}
      ref={cardRef}
    >
      <div className="cardTitles">
        <h1>{title}</h1>
        <div className="links">
          {externalLink && (
            <a
              className="linkURL"
              href={externalLink}
              title="Ir al enlace"
              target="_blank"
              rel="noreferrer"
            >
              <URLIcon fontSize={19} />
            </a>
          )}
          <div
            className="expandIndicatorButton"
            onClick={expandClick}
            onKeyDown={() => {}}
            role="button"
            title="Abrir indicador"
            tabIndex={0}
          >
            <PlusIcon fontSize={30} color="#e84a60" />
          </div>
        </div>
      </div>
      <h2>{lastUpdate}</h2>
      <h3>OBJETIVO</h3>
      <h4>{target}</h4>
      <h3>ESCALA</h3>
      <h4>{scale.join(", ")}</h4>
    </div>
  );
}
