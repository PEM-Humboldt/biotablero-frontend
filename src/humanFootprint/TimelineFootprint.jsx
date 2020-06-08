import React from 'react';
import PropTypes from 'prop-types';
import GeneralArea from '../commons/GeneralArea';
import GraphLoader from '../charts/GraphLoader';
import matchColor from '../commons/matchColor';

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

const getLabel = (type) => {
  switch (type) {
    case 'paramo': return 'Páramos';
    case 'wetland': return 'Húmedales';
    case 'dryForest': return 'Bosques secos';
    default: return 'Área Total';
  }
};

const processData = (data) => {
  if (!data) return [];
  return data.map(obj => ({
    ...obj,
    label: getLabel(obj.id),
  }));
};

const TimelineFootprint = (props) => {
  const {
    generalArea,
    setSelection,
    data,
  } = props;
  return (
    <div className="graphcontainer pt5" style={{ width: '100%' }}>
      <GeneralArea
        value={generalArea}
      />
      <h4>
        Valores promedio en el área
      </h4>
      <h6>
        Diferenciados entre área total y cada ecosistema estratégico
      </h6>
      <div className="graficaeco" style={{ width: '100%' }}>
        <h2>
          <GraphLoader
            graphType="MultiLinesGraph"
            onClickHandler={setSelection}
            colors={matchColor('hfTimeline')}
            data={processData(data)}
            markers={changeValues}
            labelX="Año"
            labelY="Indice promedio Huella Humana"
            width="100%"
          />
        </h2>
        Área del ecosistema dentro de la unidad de consulta: 332 ha
      </div>
    </div>
  );
};

TimelineFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
  setSelection: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};

export default TimelineFootprint;
