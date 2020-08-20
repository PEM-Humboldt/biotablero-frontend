import React from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';

import GraphLoader from '../../charts/GraphLoader';
import matchColor from '../../commons/matchColor';
import RestAPI from '../../api/RestAPI';
import SearchContext from '../../SearchContext';
import ShortInfo from '../../commons/ShortInfo';

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
      hfTimeline: [],
      selectedEcosystem: null,
    };
  }

  componentDidMount() {
    const { areaId, geofenceId } = this.context;
    Promise.all([
      RestAPI.requestSEHFTimeline(areaId, geofenceId, 'Páramo'),
      RestAPI.requestSEHFTimeline(areaId, geofenceId, 'Humedal'),
      RestAPI.requestSEHFTimeline(areaId, geofenceId, 'Bosque Seco Tropical'),
      RestAPI.requestTotalHFTimeline(areaId, geofenceId),
    ])
      .then(([paramo, wetland, dryForest, aTotal]) => {
        this.setState({ hfTimeline: this.processData([paramo, wetland, dryForest, aTotal]) });
      })
      .catch(() => {});
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
   * Set data about selected ecosystem
   *
   * @param {string} seType type of strategic ecosystem to request
   */
  setSelectedEcosystem = (seType) => {
    const {
      areaId,
      geofenceId,
    } = this.context;
    if (seType !== 'aTotal') {
      RestAPI.requestSEDetailInArea(areaId, geofenceId, this.getLabel(seType))
        .then((value) => {
          const res = { ...value, type: seType };
          this.setState({ selectedEcosystem: res });
        });
    } else {
      this.setState({ selectedEcosystem: null });
    }
  }

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
      case 'dryForest': return 'Bosque Seco Tropical';
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
      label: this.getLabel(obj.key).substr(0, 11),
    }));
  };

  render() {
    const {
      onClickGraphHandler,
    } = this.props;
    const {
      showInfoGraph,
      hfTimeline,
      selectedEcosystem,
    } = this.state;
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
              data={hfTimeline}
              markers={changeValues}
              labelX="Año"
              labelY="Indice promedio Huella Humana"
              onClickGraphHandler={(selection) => {
                this.setSelectedEcosystem(selection);
                onClickGraphHandler(selection);
              }}
            />
          </h2>
          {selectedEcosystem && (
            <div>
              <h6>
                {`${this.getLabel(selectedEcosystem.type)} dentro de la unidad de consulta`}
              </h6>
              <h5>
                {`${numberWithCommas(Number(selectedEcosystem.total_area).toFixed(2))} ha`}
              </h5>
            </div>
          )}
        </div>
      </div>
    );
  }
}

TimelineFootprint.propTypes = {
  onClickGraphHandler: PropTypes.func,
};

TimelineFootprint.defaultProps = {
  onClickGraphHandler: () => {},
};

export default TimelineFootprint;

TimelineFootprint.contextType = SearchContext;
