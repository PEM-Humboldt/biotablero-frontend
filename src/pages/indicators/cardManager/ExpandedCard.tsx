import { useEffect, useRef } from "react";

import { URLIcon, MinusIcon } from "core/ui/IconsIndicators";

export type ExpandedCardItem = {
  id: string;
  title: string;
  target: string;
  lastUpdate: string;
  scale: string[];
  goals: string[];
  periodicity: string;
  use: string;
  description: string;
  ebv: string[];
  source: string;
  requirements: string;
  externalLink: string;
};

export type ExpandedCardProps = {
  item: ExpandedCardItem;
  expandClick: () => void;
};

export function ExpandedCard({
  item: {
    id,
    title = "",
    target = "",
    lastUpdate = "",
    scale = [],
    externalLink = "",
    goals = [],
    periodicity = "",
    use = "",
    description = "",
    requirements = "",
    ebv = [],
    source = "",
  },
  expandClick,
}: ExpandedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div id={id} className="indicatorCard expandedCard" ref={cardRef}>
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
              <URLIcon fontSize={30} />
            </a>
          )}
          <div
            className="expandIndicatorButton"
            onClick={expandClick}
            onKeyDown={() => {}}
            role="button"
            title="Cerrar indicador"
            tabIndex={0}
          >
            <MinusIcon fontSize={30} color="#e84a60" />
          </div>
        </div>
      </div>
      <h2>{lastUpdate}</h2>
      <div className="spliter">
        <div className="colsm">
          {target && (
            <>
              <h3>OBJETIVO</h3>
              <h4>{target}</h4>
            </>
          )}
          {scale.length > 0 && (
            <>
              <h3>ESCALA</h3>
              <h4>{scale.join(", ")}</h4>
            </>
          )}
          {goals.length > 0 && (
            <>
              <h3>METAS</h3>
              <h4>{goals.join("\n")}</h4>
            </>
          )}
          {periodicity && (
            <>
              <h3>PERIODICIDAD</h3>
              <h4>{periodicity}</h4>
            </>
          )}
        </div>
        <div className="colbg">
          {description && (
            <>
              <h3>DESCRIPCIÓN DEL INDICADOR</h3>
              <h4> {description} </h4>
            </>
          )}
          {requirements && (
            <>
              <h3>REQUERIMIENTO DE INFORMACIÓN PARA SU CÁLCULO</h3>
              <h4>{requirements}</h4>
            </>
          )}
          {ebv.length > 0 && (
            <>
              <br />
              <h4>
                <b>VEBs:</b> {ebv.join(",")}
              </h4>
            </>
          )}
          {use && (
            <>
              <h3>CONTEXTO DE USO</h3>
              <h4>{use}</h4>
            </>
          )}
          {source && (
            <>
              <h3>FUENTE</h3>
              <h4>{source}</h4>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
