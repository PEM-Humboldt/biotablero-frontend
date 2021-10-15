import React, { useState } from 'react';

import './main.css';
import CardManager from './app/CardManager';
import cardsData from './app/data/selectorData';
import DownloadIcon from './app/DownloadIcon';
import OpenIcon from './components/OpenIcon';
import CloseIcon from './components/CloseIcon';

const App = () => {
  const [openFilter, setOpenFilter] = useState(true);

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
        </div>
      </div>
      <div>
        <div className="countD">
          {cardsData.length > 0 ? (
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
          ) : (
            'No hay indicadores'
          )}
        </div>
        <CardManager cardsData={cardsData} />
      </div>
    </div>
  );
};

export default App;
