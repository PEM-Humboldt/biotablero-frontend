import Plot from 'react-plotly.js';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import loadCsv from './data/loadData';

const M06 = ({ asocId }) => {
  const [data, setData] = useState(null);
  const [datatest1, setDatatest1] = useState(null);
  const [datatest2, setDatatest2] = useState(null);
  const [scater1, setScater1] = useState(null);
  const [scater2, setScater2] = useState(null);
  const [colors, setColors] = useState(['#ab84ab', '#f9bb44', '#71c5a0']);
  const xArray = [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
  const yArray = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 18, 19, 20, 33, 35, 37, 40, 35, 38, 42, 15];
  const x2 = [37, 72, 50, 66, 70, 159, 80, 100, 117];
  const y2 = [33, 20, 13, 19, 27, 19, 35, 44, 38];
  const colorBands = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];
  const layerColors = [
    '#D09329',
    '#F0DFC2',
    '#97CA3C',
    '#41B649',
    '#69C7B5',
    '#00BFEB',
    '#6B92CC',
    '#306FB6',
    '#3654A4',
  ];
  const shapesArr = [];
  colorBands.map((value, key, elements) =>
    elements[key + 1]
      ? shapesArr.push({
          type: 'rect',
          xref: 'paper',
          yref: 'y',
          x0: 0,
          x1: 1,
          y0: value,
          y1: elements[key + 1],
          fillcolor: layerColors[key],
          opacity: 0.3,
          line: {
            width: 0,
          },
        })
      : null
  );

  useEffect(() => {
    const getData = async () => {
      const csvData = await loadCsv('reg_diarios');
      switch (asocId) {
        case 'AMUSI':
          setData({ 'Vereda 1': csvData['Vereda 1'] });
          setColors(['#ab84ab']);
          setDatatest1({
            x: [1, 2, 3, 4, 5],
            y: [1, 5, 12, 8, 11],
            mode: 'lines',
            name: 'Solid',
            line: {
              dash: 'solid',
              width: 4,
            },
          });
          setDatatest2({
            x: [0, 1, 2, 3, 4, 5],
            y: [1, 5, 7, -1.2, 8, 13],
            type: 'bar',
          });
          setScater1({
            x: xArray,
            y: yArray,
            mode: 'markers',
            type: 'scatter',
            name: 'Valores 1',
            marker: {
              color: 'rgb(224, 151, 226)',
              size: 12,
              line: {
                color: 'white',
                width: 0.5,
              },
            },
          });
          setScater2({
            x: x2,
            y: y2,
            mode: 'markers',
            type: 'scatter',
            name: 'Valores 2',
            marker: {
              color: 'rgb(142, 124, 195)',
              size: 12,
              line: {
                color: 'white',
                width: 0.5,
              },
            },
          });
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
      <h3>Precipitación diaria Multigraph</h3>
      <div id="reg_diarios">
        {!data ? (
          'cargando...'
        ) : (
          <Plot
            data={[datatest1, datatest2]}
            layout={{
              fileopt: 'overwrite',
              filename: 'simple-node-example',
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
            config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
          />
        )}
      </div>
      <h3>Precipitación diaria Scatter plot con layout colorido</h3>
      <div id="reg_diarios">
        {!data ? (
          'cargando...'
        ) : (
          <Plot
            data={[scater1, scater2]}
            layout={{
              shapes: shapesArr,
              height: 500,
              width: 500,
              title: 'Grafica con layout multicolor',
              xaxis: {
                title: 'Eje X',
                showgrid: false,
                zeroline: false,
              },
              yaxis: {
                title: 'Tipo de datos eje Y',
                showline: false,
              },
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
            config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
          />
        )}
      </div>
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
