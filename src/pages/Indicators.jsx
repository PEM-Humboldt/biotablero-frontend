import React, { useEffect, useState } from "react";

import CardManager from "pages/indicators/app/CardManager";
import TagManager from "pages/indicators/app/TagManager";
import MinusIcon from "pages/indicators/components/MinusIcon";
import PlusIcon from "pages/indicators/components/PlusIcon";
import useUpdateResults from "pages/indicators/hooks/useUpdateResults";
import { getTags } from "pages/indicators/utils/firebase";

import "pages/indicators/main.css";

export const Indicators = () => {
  const [openFilter, setOpenFilter] = useState(true);
  const [tags, setTags] = useState(new Map());
  const [loadingTags, setLoadingTags] = useState(true);
  const {
    loading: loadingData,
    result: cardsData,
    updateFilters,
  } = useUpdateResults();

  useEffect(async () => {
    const tagsData = await getTags();
    setTags(tagsData);
    setLoadingTags(false);
  }, []);

  const filterData = (filters) => {
    updateFilters(filters);
  };

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
        {loadingData && "Cargando información..."}
        {!loadingData && cardsData.length <= 0 && "No hay indicadores"}
        {!loadingData && cardsData.length > 0 && (
          <>{cardsData.length} indicadores</>
        )}
      </div>
      <div className="masonry-cards">
        <CardManager cardsData={cardsData} />
      </div>
    </div>
  );
};
