import React, { useEffect, useState } from 'react';

// import cardsData from './app/data/selectorData';
import CardManager from './app/CardManager';
import CloseIcon from './components/CloseIcon';
import DownloadIcon from './app/DownloadIcon';
import OpenIcon from './components/OpenIcon';
import getIndicators from './utils/firebase';

import './main.css';

const App = () => {
  const [openFilter, setOpenFilter] = useState(true);
  const [cardsData, setCardsData] = useState([]);

  useEffect(async () => {
    const data = await getIndicators();
    setCardsData(data);
  }, []);

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
