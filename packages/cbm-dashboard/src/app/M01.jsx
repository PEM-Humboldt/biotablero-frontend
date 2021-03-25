import Plot from 'react-plotly.js';
import React, { useState, useEffect } from 'react';

import loadCsv from './data/loadData';

const M01 = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => setData(await loadCsv('disturbios'));
    getData();
  }, []);

  return (
    <div id="01_validacion_coberturas">
      <h2>Validación de coberturas</h2>
      <h3>Disturbios</h3>
      <div id="disturbios">
        {!data ? (
          'cargando...'
        ) : (
          <Plot
            data={[
              {
                ...data,
                type: 'pie',
              },
            ]}
            layout={{
              margin: { t: 10 },
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
            config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
          />
        )}
      </div>
    </div>
  );
};

export default M01;
