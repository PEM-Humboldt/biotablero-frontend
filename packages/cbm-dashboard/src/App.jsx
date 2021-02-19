import React, { useState } from 'react';

import M01 from './M01';
import M02 from './M02';
import M06 from './M06';

const App = () => {
  const [metodology, setMetodology] = useState('');

  return (
    <div className="wrapper">
      <h1>Avances monitoreo comunitario</h1>
      <label htmlFor="sel_metodologia">
        Seleccione la metodología de monitoreo:
        <select
          id="sel_metodologia"
          onChange={(event) => setMetodology(event.target.value)}
          aria-label="metodologia"
        >
          <option disabled selected>
            -- Seleccione una opción --
          </option>
          <option value="01_validacion_coberturas">
            M01 - Validación de coberturas
          </option>
          <option value="02_parcela_vegetacion">
            M02 - Parcela de vegetación
          </option>
          <option value="06_medicion_lluvia">M06 - Medición de lluvia</option>
        </select>
      </label>
      {metodology === '01_validacion_coberturas' && <M01 />}
      {metodology === '02_parcela_vegetacion' && <M02 />}
      {metodology === '06_medicion_lluvia' && <M06 />}
    </div>
  );
};

export default App;
