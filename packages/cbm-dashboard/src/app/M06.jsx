import Plot from 'react-plotly.js';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import loadCsv from './data/loadData';

const M06 = ({ asocId }) => {
  const [data, setData] = useState(null);
  const [colors, setColors] = useState(['#ab84ab', '#f9bb44', '#71c5a0']);
  useEffect(() => {
    const getData = async () => {
      const csvData = await loadCsv('reg_diarios');
      switch (asocId) {
        case 'AMUSI':
          setData({ 'Vereda 1': csvData['Vereda 1'] });
          setColors(['#ab84ab']);
          break;
        case 'ASICAC':
          setData({ 'Vereda 2': csvData['Vereda 2'] });
          setColors(['#f9bb44']);
          break;
        case 'ASOBRASILAR':
          setData({ 'Vereda 3': csvData['Vereda 3'] });
          setColors(['#71c5a0']);
          break;
        default:
          setData(csvData);
          setColors(['#ab84ab', '#f9bb44', '#71c5a0']);
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
