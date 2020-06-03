import React from 'react';
import PropTypes from 'prop-types';
import GeneralArea from '../commons/GeneralArea';
import MultiLinesGraph from '../charts/MultiLinesGraph';
import matchColor from '../commons/matchColor';

import { dataLines } from '../search/assets/selectorData';

const matchColorAndData = {
  hfTotal: 'Área total',
  hfMoor: 'Páramo',
  hfWetlands: 'Humedales',
  hfDryForest: 'Bosques Secos',
};

const changeValues = [
  {
    axis: 'y',
    value: 15,
    legend: 'Natural',
    lineStyle: { stroke: '#3fbf9f', strokeWidth: 1 },
    textStyle: {
      fill: '#3fbf9f',
      fontSize: 9,
    },
    legendPosition: 'bottom-right',
    orient: 'top',
    tickRotation: -90,
  },
  {
    axis: 'y',
    value: 30,
    legend: 'Baja',
    lineStyle: { stroke: '#d5a529', strokeWidth: 1 },
    textStyle: {
      fill: '#d5a529',
      fontSize: 9,
    },
    legendPosition: 'bottom-right',
    orient: 'top',
    tickRotation: -90,
  },
  {
    axis: 'y',
    value: 60,
    legend: 'Media',
    lineStyle: { stroke: '#e66c29', strokeWidth: 1 },
    textStyle: {
      fill: '#e66c29',
      fontSize: 9,
    },
    legendPosition: 'bottom-right',
    orient: 'top',
    tickRotation: -90,
  },
  {
    axis: 'y',
    value: 100,
    legend: 'Alta',
    lineStyle: { stroke: '#cf324e', strokeWidth: 1 },
    textStyle: {
      fill: '#cf324e',
      fontSize: 9,
    },
    legendPosition: 'bottom-right',
    orient: 'top',
    tickRotation: -90,
  },
];

const TimelineFootprint = ({ generalArea, selection, setSelection }) => (
  <div className="graphcontainer pt5">
    <GeneralArea
      value={generalArea}
    />
    <h4>
      Valores promedio en el área
    </h4>
    <h6>
      Diferenciados entre área total y cada ecosistema estratégico
    </h6>
    <div className="graficaeco">
      <h2>
        <MultiLinesGraph
          setSelection={setSelection}
          colors={matchColor(Object.keys(matchColorAndData).find(
            key => matchColorAndData[key] === selection,
          ))}
          data={dataLines}
          markers={changeValues}
          labelX="Año"
          labelY="Indice promedio Huella Humana"
        />
      </h2>
      Área del ecosistema dentro de la unidad de consulta: 332 ha
    </div>
  </div>
);

TimelineFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
  selection: PropTypes.string.isRequired,
  setSelection: PropTypes.func.isRequired,
};

export default TimelineFootprint;
