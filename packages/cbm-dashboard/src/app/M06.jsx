import Plot from 'react-plotly.js';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import loadCsv from './data/loadData';

const M06 = ({ asocId }) => {
  const [data, setData] = useState(null);
  const [colors, setColors] = useState(['#1f77b4', '#ff7f0e', '#2ca02c']);
  useEffect(() => {
    const getData = async () => {
      const csvData = await loadCsv('reg_diarios');
      switch (asocId) {
        case 'AMUSI':
          setData({ 'Vereda 1': csvData['Vereda 1'] });
          setColors(['#1f77b4']);
          break;
        case 'ASICAC':
          setData({ 'Vereda 2': csvData['Vereda 2'] });
          setColors(['#ff7f0e']);
          break;
        case 'ASOBRASILAR':
          setData({ 'Vereda 3': csvData['Vereda 3'] });
          setColors(['#2ca02c']);
          break;
        default:
          setData(csvData);
          setColors(['#1f77b4', '#ff7f0e', '#2ca02c']);
          break;
      }
    };
    getData();
  }, [asocId]);

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
              colorway: colors,
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

M06.propTypes = {
  asocId: PropTypes.string,
};

M06.defaultProps = {
  asocId: 'GENERAL',
};
export default M06;
