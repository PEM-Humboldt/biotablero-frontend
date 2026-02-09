import { useEffect, useState } from "react";

import { MinusIcon, PlusIcon } from "@ui/IconsIndicators";
import type { UiManager } from "core/layout/MainLayout";
import { CardManager } from "pages/indicators/CardManager";
import { TagManager } from "pages/indicators/TagManager";
import { useCardTags } from "pages/indicators/hooks/useCardTags";
import { useIndicatorsCards } from "pages/indicators/hooks/useIndicatorsCards";

import "pages/indicators/layout/main.css";
import { useOutletContext } from "react-router";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { Sheet, SheetContent, SheetTrigger } from "@ui/shadCN/component/sheet";

export function Indicators() {
  const { layoutDispatch } = useOutletContext<UiManager>();
  const [openFilter, setOpenFilter] = useState(true);
  const { isLoadingTags, tags } = useCardTags();
  const { isLoadingCards, cards, updateCardFilters } = useIndicatorsCards();

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleName: "Indicadores",
        logos: new Set(),
        className: "fullgrid",
      },
    });
  }, [layoutDispatch]);

  const hasTags = tags.size > 0;
  const hasCards = cards.length > 0;
  const showFilters = openFilter && !isLoadingTags && hasTags;

  return (
    <main className="">
      <aside className="bg-muted">
        <header>
          <h3>
            <button
              className=""
              type="button"
              onClick={() => setOpenFilter(!openFilter)}
              title={openFilter ? "Ocultar filtros" : "Mostrar filtros"}
            >
              {openFilter ? (
                <MinusIcon fontSize={30} color="#fff" />
              ) : (
                <PlusIcon fontSize={30} color="#fff" />
              )}
              <span className="">Filtros de búsqueda</span>
            </button>
          </h3>
        </header>
        <nav>
          <p style={{ color: "#fff", margin: "5px 15px" }}>
            {isLoadingTags && "Cargando filtros..."}
            {!isLoadingTags && !hasTags && "No hay filtros disponibles"}
          </p>

          {showFilters && (
            <div className={`leftnav-filters${openFilter ? "" : " hide"}`}>
              <TagManager data={tags} filterData={updateCardFilters} />
            </div>
          )}
        </nav>
      </aside>
      <section className="">
        <header>
          {isLoadingTags && "Cargando información..."}
          {!isLoadingTags && hasCards
            ? `${cards.length} indicadores`
            : "No hay indicadores"}
        </header>
        {hasCards && <CardManager cardsData={cards} />}
      </section>
    </main>
  );
}
