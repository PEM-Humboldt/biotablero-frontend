import React, { useState } from 'react';

import './main.css';

const App = () => {
  const [stateVal, setStateVal] = useState(1);
  const [openFilter, setOpenFilter] = useState(true);

  return (
    <div className="wrapper">
      <div>
        <h3>
          <button type="button" onClick={() => setOpenFilter(!openFilter)}>
            {openFilter ? '-' : '+'}
          </button>
          Filtros de búsqueda{' '}
        </h3>
        {openFilter && (
          <div>
            <h4>
              <button type="button" onClick={() => setOpenFilter(!openFilter)}>
                x
              </button>
              8 filtros
            </h4>
          </div>
        )}
      </div>
      <div className="wrapperIndicators">
        <div>27 indicadores</div>
        <div>Este es el ejemplo de estado con hooks :D: {stateVal}</div>
        <div>
          Aumenta el estado:{' '}
          <button type="button" onClick={() => setStateVal(stateVal + 1)}>
            ++
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
