import React, { useState } from 'react';

import './main.css';
import CardManager from './CardManager';
import cardsData from './data/selectorData';

const App = () => {
  const [openFilter, setOpenFilter] = useState(true);

  return (
    <div className="wrapperIndicators">
      <div className="leftnav">
        <div className="card2">
          <h3>
            <button type="button" onClick={() => setOpenFilter(!openFilter)}>
              {openFilter ? '-' : '+'}
            </button>{' '}
            Filtros de búsqueda{' '}
          </h3>
          {openFilter && (
            <div>
              <h4>
                <button type="button" onClick={() => setOpenFilter(!openFilter)}>
                  x
                </button>{' '}
                (Prueba de apertura del menú)
              </h4>
            </div>
          )}
        </div>
      </div>
      <div>
        <div>{cardsData ? `${cardsData.length} indicadores` : 'No hay indicadores'}</div>
        <CardManager cardsData={cardsData} />
      </div>
    </div>
  );
};

export default App;
