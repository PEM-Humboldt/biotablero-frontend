import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { CirclePlus } from "lucide-react";

import { SidebarInset, useSidebar } from "@ui/shadCN/component/sidebar";
import { Button } from "@ui/shadCN/component/button";
import { StrValidator } from "@utils/strValidator";

import { Card } from "pages/indicators/cardManager/Card";
import type { IndicatorsCardInfo } from "pages/indicators/types/card";

export function CardManager({
  cardsData,
  isLoading,
}: {
  isLoading: boolean;
  cardsData: IndicatorsCardInfo[];
}) {
  const { setOpen, open } = useSidebar();
  const navigate = useNavigate();
  const { hash, pathname } = useLocation();
  const cardOpen = !hash ? null : hash.slice(1);

  useEffect(() => {
    if (cardOpen) {
      const element = document.getElementById(cardOpen);
      if (!element) {
        return;
      }

      // NOTE: el timer está para asegurar que el Reflow y Repaint del DOM
      // terminó en el eventLoop y evitar errores de cálculo en la posición.
      setTimeout(
        () => element.scrollIntoView({ behavior: "smooth", block: "start" }),
        0,
      );
    }
  }, [cardOpen]);

  const expandCardHandler = (cardId: string) => {
    const sanitizedID = StrValidator.sanitizeToURLSlug(cardId);
    if (sanitizedID === cardOpen) {
      void navigate(pathname, { replace: true });
      return;
    }

    void navigate(`#${sanitizedID}`);
  };

  const hasCards = cardsData.length > 0;

  return (
    <SidebarInset className="bg-background">
      <header className="flex min-h-14 gap-2 p-2 text-xl! items-center text-primary! font-normal!">
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

      <div className="@container px-4 pb-4 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 grid-flow-dense">
        {hasCards &&
          cardsData.map((card) => (
            <Card
              key={card.id}
              item={card}
              nowOpen={cardOpen}
              expandCard={expandCardHandler}
            />
          ))}
      </div>
    </SidebarInset>
  );
}
