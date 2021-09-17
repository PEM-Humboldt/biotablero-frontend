import React, { useState } from 'react';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

import './main.css';
import CardManager from './app/CardManager';
import cardsData from './app/data/selectorData';

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
        </div>
      </div>
      <div>
        <div className="countD">
          {cardsData ? `${cardsData.length} indicadores` : 'No hay indicadores'}
          <SaveAltIcon color="#e84a5f" />
        </div>
        <CardManager cardsData={cardsData} />
      </div>
    </div>
  );
};

export default App;
