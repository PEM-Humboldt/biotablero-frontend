import React, { useState } from 'react';

import './main.css';

const App = () => {
  const [stateVal, setStateVal] = useState(1);

  return (
    <div className="wrapperIndicators">
      <div>Este es un ejemplo de estado con hooks :D: {stateVal}</div>
      <div>
        Aumenta el estado:{' '}
        <button type="button" onClick={() => setStateVal(stateVal + 1)}>
          ++
        </button>
      </div>
    </div>
  );
};

export default App;
