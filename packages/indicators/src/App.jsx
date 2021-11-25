import React, { useEffect, useState } from 'react';

import CardManager from './app/CardManager';
import DownloadIcon from './app/DownloadIcon';
import TagManager from './app/TagManager';
import CloseIcon from './components/CloseIcon';
import OpenIcon from './components/OpenIcon';
import useUpdateResults from './hooks/useUpdateResults';
import { getTags } from './utils/firebase';

import './main.css';

const App = () => {
  const [openFilter, setOpenFilter] = useState(true);
  const [tags, setTags] = useState(new Map());
  const [loadingTags, setLoadingTags] = useState(true);
  const { loading: loadingData, result: cardsData, updateFilters } = useUpdateResults();

  useEffect(async () => {
    const tagsData = await getTags();
    setTags(tagsData);
    setLoadingTags(false);
  }, []);

  const filterData = (filters) => {
    updateFilters(filters);
  };

  return (
    <div className="wrapperIndicators">
      <div className="leftnav">
        <div className="card2">
          <h3>
            <button
              className="openFilters"
              title="Ocultar filtros"
              type="button"
              onClick={() => setOpenFilter(!openFilter)}
            >
              {openFilter ? <CloseIcon color="#fff" /> : <OpenIcon color="#fff" />}
            </button>
            <div className="text">Filtros de búsqueda</div>
          </h3>
          {loadingTags && (
            <div style={{ color: '#fff', margin: '5px 15px' }}>Cargando filtros...</div>
          )}
          {!loadingTags && tags.size <= 0 && (
            <div style={{ color: '#fff', margin: '5px 15px' }}>No hay filtros disponibles</div>
          )}
          {!loadingTags && tags.size > 0 && openFilter && (
            <TagManager data={tags} filterData={filterData} />
          )}
        </div>
      </div>
      <div>
        <div className="countD">
          {loadingData && 'Cargando información...'}
          {!loadingData && cardsData.length <= 0 && 'No hay indicadores'}
          {!loadingData && cardsData.length > 0 && (
            <>
              {cardsData.length} indicadores
              <button
                className="downloadAll"
                title="Descargar indicadores listados"
                type="button"
                onClick={() => {}}
              >
                <DownloadIcon color="#e84a5f" />
              </button>
            </>
          )}
        </div>
        <CardManager cardsData={cardsData} />
      </div>
    </div>
  );
};

export default App;
