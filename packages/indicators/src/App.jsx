import React, { useState } from 'react';

import './main.css';
import CardManager from './app/CardManager';
import cardsData from './app/data/selectorData';
import DownloadIcon from './app/cardManager/card/DownloadIcon';
import OpenIcon from './app/cardManager/card/OpenIcon';
import CloseIcon from './app/cardManager/card/CloseIcon';

const App = () => {
  const [openFilter, setOpenFilter] = useState(true);

  return (
    <div className="wrapperIndicators">
      <div className="leftnav">
        <div className="card2">
          <h3>
            <button type="button" onClick={() => setOpenFilter(!openFilter)}>
              {openFilter ? <CloseIcon /> : <OpenIcon />}
            </button>
            Filtros de búsqueda
          </h3>
        </div>
      </div>
      <div>
        <div className="countD">
          {cardsData.length > 0 ? (
            <>
              {cardsData.length} indicadores
              <button
                title="Descargar indicadores listados"
                className="downloadAll"
                type="button"
                onClick={() => {}}
              >
                <DownloadIcon />
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
