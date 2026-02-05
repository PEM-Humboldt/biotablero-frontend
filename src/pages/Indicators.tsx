import { useCallback, useEffect, useState } from "react";

import { MinusIcon, PlusIcon } from "@ui/IconsIndicators";
import type { UiManager } from "core/layout/MainLayout";
import { CardManager } from "pages/indicators/CardManager";
import { TagManager } from "pages/indicators/TagManager";
import { useUpdateResults } from "pages/indicators/hooks/useUpdateResults";
import { getTags } from "pages/indicators/utils/firebase";

import "pages/indicators/layout/main.css";
import { useOutletContext } from "react-router";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";

export function Indicators() {
  const { layoutDispatch } = useOutletContext<UiManager>();
  const [openFilter, setOpenFilter] = useState(true);
  const [tags, setTags] = useState(new Map<string, string[]>());
  const [loadingTags, setLoadingTags] = useState(true);
  const { isLoading, result: cardsData, updateFilters } = useUpdateResults();

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

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await getTags();
        setTags(tagsData);
      } catch (err) {
        console.warn("cannot get tag data:", err);
      } finally {
        setLoadingTags(false);
      }
    };
    void fetchTags();
  }, []);

  const filterData = useCallback(
    (filters: string[]) => {
      updateFilters(filters);
    },
    [updateFilters],
  );

  return (
    <div className={`wrapperIndicators${openFilter ? "" : " full-content"}`}>
      <div className={`leftnav-title${openFilter ? "" : " closed-filters"}`}>
        <div className="card2">
          <h3>
            <button
              className="openFilters"
              title="Ocultar filtros"
              type="button"
              onClick={() => setOpenFilter(!openFilter)}
            >
              {openFilter ? (
                <MinusIcon fontSize={30} color="#fff" />
              ) : (
                <PlusIcon fontSize={30} color="#fff" />
              )}
            </button>
            <div className="text">Filtros de búsqueda</div>
          </h3>
          {loadingTags && (
            <div style={{ color: "#fff", margin: "5px 15px" }}>
              Cargando filtros...
            </div>
          )}
          {!loadingTags && tags.size <= 0 && (
            <div style={{ color: "#fff", margin: "5px 15px" }}>
              No hay filtros disponibles
            </div>
          )}
        </div>
      </div>
      {!loadingTags && tags.size > 0 && (
        <div className={`leftnav-filters${openFilter ? "" : " hide"}`}>
          <TagManager data={tags} filterData={filterData} />
        </div>
      )}
      <div className="countD">
        {loadingTags && "Cargando información..."}
        {!loadingTags && cardsData.length <= 0 && "No hay indicadores"}
        {!loadingTags && cardsData.length > 0 && (
          <>
            {cardsData.length}
            indicadores
          </>
        )}
      </div>
      <div className="masonry-cards">
        <CardManager cardsData={cardsData} />
      </div>
    </div>
  );
}
