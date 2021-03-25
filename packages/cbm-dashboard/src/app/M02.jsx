import Plot from 'react-plotly.js';
import React, { useState, useEffect } from 'react';

import loadCsv from './data/loadData';

const M02 = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => setData(await loadCsv('habito_crecimiento'));
    getData();
  }, []);

  return (
    <div id="02_parcela_vegetacion">
      <h2>Parcela de vegetación</h2>
      <h3>Hábito de crecimiento</h3>
      <div id="habito_crecimiento">
        {!data ? (
          'cargando...'
        ) : (
          <Plot
            data={Object.keys(data).map((name) => ({
              ...data[name],
              name,
              type: 'bar',
            }))}
            layout={{
              xaxis: { title: 'Fecha', automargin: true },
              yaxis: { title: 'Categorías (%)' },
              margin: { t: 10 },
              barmode: 'stack',
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

export default M02;
