import { useEffect } from "react";
import { useOutletContext } from "react-router";

import { SidebarProvider } from "@ui/shadCN/component/sidebar";

import type { UiManager } from "core/layout/MainLayout";
import { CardManager } from "pages/indicators/CardManager";
import { TagManager } from "pages/indicators/TagManager";
import { useIndicatorsCards } from "pages/indicators/hooks/useIndicatorsCards";
import "pages/indicators/layout/main.css";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";

export function Indicators() {
  const { layoutDispatch } = useOutletContext<UiManager>();
  const { isLoadingCards, cards, updateCardFilters } = useIndicatorsCards();

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleName: "Indicadores",
        logos: new Set(),
      },
    });
  }, [layoutDispatch]);

  return (
    <SidebarProvider>
      <TagManager filterData={updateCardFilters} />
      <CardManager isLoading={isLoadingCards} cardsData={cards} />
    </SidebarProvider>
  );
}
