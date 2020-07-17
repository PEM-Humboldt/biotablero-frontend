import React from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../../commons/ShortInfo';
import GraphLoader from '../../charts/GraphLoader';
import matchColor from '../../commons/matchColor';

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

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

class TimelineFootprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
    };
  }

  /**
   * Show or hide the detailed information on each graph
   */
  toggleInfoGraph = () => {
    this.setState(prevState => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  /**
   * Defines the label for a given data
   * @param {string} type data identifier
   *
   * @returns {string} label to be used for tooltips, legends, etc.
   * Max. length = 16 characters
   */
  getLabel = (type) => {
    switch (type) {
      case 'paramo': return 'Páramo';
      case 'wetland': return 'Humedal';
      case 'dryForest': return 'Bosque seco';
      default: return 'Área total';
    }
  };

  /**
   * Transform data to fit in the graph structure
   * @param {array} data data to be transformed
   *
   * @returns {array} data transformed
   */
  processData = (data) => {
    if (!data) return [];
    return data.map(obj => ({
      ...obj,
      label: this.getLabel(obj.key),
    }));
  };

  render() {
    const {
      data,
      onClickGraphHandler,
      hfTimelineArea,
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
              colors={matchColor('hfTimeline')}
              data={this.processData(data)}
              markers={changeValues}
              labelX="Año"
              labelY="Indice promedio Huella Humana"
              onClickGraphHandler={onClickGraphHandler}
            />
          </h2>
          {hfTimelineArea && hfTimelineArea.type !== 'Total' && (
            <div>
              <h6>
                {`${hfTimelineArea.type} dentro de la unidad de consulta`}
              </h6>
              <h5>
                {`${numberWithCommas(Number(hfTimelineArea.total_area).toFixed(2))} ha`}
              </h5>
            </div>
          )}
        </div>
      </div>
    );
  }
}

TimelineFootprint.propTypes = {
  data: PropTypes.array.isRequired,
  onClickGraphHandler: PropTypes.func,
  hfTimelineArea: PropTypes.object,
};

TimelineFootprint.defaultProps = {
  onClickGraphHandler: () => {},
  hfTimelineArea: {},
};

export default TimelineFootprint;
