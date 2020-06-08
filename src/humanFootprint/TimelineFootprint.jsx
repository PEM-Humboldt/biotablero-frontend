import React from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';
import GraphLoader from '../charts/GraphLoader';
import matchColor from '../commons/matchColor';

const matchColorAndData = {
  'Área total': 'hfTotal',
  Páramo: 'hfMoor',
  Humedales: 'hfWetlands',
  'Bosques Secos': 'hfDryForest',
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

class TimelineFootprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
    };
  }

  toggleInfoGraph = () => {
    this.setState(prevState => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  render() {
    const {
      selection,
      setSelection,
      data,
    } = this.props;
    const { showInfoGraph } = this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <InfoIcon
            className="graphinfo"
            data-tooltip
            title="¿Qué significa este gráfico?"
            onClick={() => this.toggleInfoGraph()}
          />
          <div
            className="graphinfo"
            onClick={() => this.toggleInfoGraph()}
            onKeyPress={() => this.toggleInfoGraph()}
            role="button"
            tabIndex="0"
          />
        </h2>
        {(
          showInfoGraph && (
          <ShortInfo
            name="Huella Humana en el tiempo"
            description="Se mostrará una gráfica de 4 líneas, una con el valor promedio de la huella en cada año para la unidad de consulta, la cual siempre estará resaltada en el gráfico, y las demás mostrarán el valor promedio en cada ecosistema estratégico"
            className="graphinfo2"
            tooltip="¿Qué significa?"
            customButton
          />
          )
        )}
        <h6>
          Huella humana comparada con EE
        </h6>
        <p>
          Haz clic en un ecosistema para ver su comportamiento
        </p>
        <div>
          <h2>
            <GraphLoader
              graphType="MultiLinesGraph"
              setSelection={setSelection}
              colors={matchColor(matchColorAndData[selection])}
              data={data}
              markers={changeValues}
              labelX="Año"
              labelY="Indice promedio Huella Humana"
            />
          </h2>
          <p>
            Área del ecosistema dentro de la unidad de consulta: 332 ha
          </p>
        </div>
      </div>
    );
  }
}

TimelineFootprint.propTypes = {
  selection: PropTypes.string.isRequired,
  setSelection: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};

export default TimelineFootprint;
