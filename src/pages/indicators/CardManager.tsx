import { useState } from "react";

import { Card } from "pages/indicators/cardManager/Card";
import type { IndicatorsCardInfo } from "pages/indicators/types/card";
import { SidebarInset, useSidebar } from "@ui/shadCN/component/sidebar";
import { CirclePlus } from "lucide-react";
import { Button } from "@ui/shadCN/component/button";
import { useNavigate } from "react-router";

export function CardManager({
  cardsData,
  isLoading,
}: {
  isLoading: boolean;
  cardsData: IndicatorsCardInfo[];
}) {
  const { setOpen, open } = useSidebar();
  const [cardOpen, setCardOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  const expandCardHandler = (cardId: string) => {
    setCardOpen((prvCard) => (cardId === prvCard ? null : cardId));
    void navigate(`#${cardId}`);
    const element = document.getElementById(cardId);
    if (element) {
      // NOTE: el timer ayuda a que los cálculos en windowY se hagan cuando ya
      // la tarjeta anterior cambio de tamaño y no haya error
      setTimeout(
        () => element.scrollIntoView({ behavior: "smooth", block: "start" }),
        0,
      );
    }
  };

  const hasCards = cardsData.length > 0;

  return (
    <SidebarInset>
      <header className="flex gap-2 p-2 items-center text-foreground text-xl text-center font-normal">
        {!open && (
          <Button
            onClick={() => setOpen(true)}
            title="Ocultar selector de filtros"
            size="lg"
            variant="ghost"
            className="text-xl text-primary font-normal"
          >
            <CirclePlus className="size-6" />
            Ver filtros
          </Button>
        )}
        {isLoading && "Cargando información..."}
        {!isLoading && hasCards
          ? `${cardsData.length} indicadores`
          : "No hay indicadores"}
      </header>

      <div>
        {hasCards &&
          cardsData.map((card) => (
            <Card
              item={card}
              nowOpen={cardOpen}
              expandCard={expandCardHandler}
            />
          ))}
      </div>
    </SidebarInset>
  );
}
