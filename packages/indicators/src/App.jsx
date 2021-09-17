import React, { useState } from 'react';

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
        <CardManager cardsData={cardsData} />
      </div>
    </div>
  );
};

export default App;
