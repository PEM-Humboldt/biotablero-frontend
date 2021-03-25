import Plot from 'react-plotly.js';
import React, { useState, useEffect } from 'react';

import loadCsv from './data/loadData';

const M06 = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => setData(await loadCsv('reg_diarios'));
    getData();
  }, []);
  return (
    <div id="06_medicion_lluvia">
      <h2>Medición de lluvia</h2>
      <h3>Precipitación diaria</h3>
      <div id="reg_diarios">
        {!data ? (
          'cargando...'
        ) : (
          <Plot
            data={Object.keys(data).map((name) => ({
              ...data[name],
              name,
              type: 'scatter',
            }))}
            layout={{
              xaxis: { title: 'Fecha', automargin: true },
              yaxis: { title: 'precipitación (cm)' },
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

export default M06;
