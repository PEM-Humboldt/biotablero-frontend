import InfoIcon from '@material-ui/icons/Info';
import PropTypes from 'prop-types';
import React from 'react';

import GraphLoader from '../../charts/GraphLoader';
import matchColor from '../../commons/matchColor';
import RestAPI from '../../api/RestAPI';
import SearchContext from '../../SearchContext';
import ShortInfo from '../../commons/ShortInfo';

class CurrentFootprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
      hfCurrent: [],
      hfCurrentValue: '0',
    };
  }

  componentDidMount() {
    const {
      areaId,
      geofenceId,
    } = this.context;

    RestAPI.requestCurrentHFValue(areaId, geofenceId)
      .then((res) => {
        this.setState({
          hfCurrentValue: Number(res.value).toFixed(2),
        });
      })
      .catch(() => {});
    RestAPI.requestCurrentHFCategories(areaId, geofenceId)
      .then((res) => {
        this.setState({
          hfCurrent: res.map(item => ({
            ...item,
            label: `${item.key[0].toUpperCase()}${item.key.slice(1)}`,
          })),
        });
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

  render() {
    const { onClickGraphHandler } = this.props;
    const { hfCurrent, hfCurrentValue } = this.state;
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
            name="Huella Humana Actual"
            description="Se mostrará el valor promedio de la huella humana en el año más reciente para la unidad de consulta seleccionada previamente. Justo debajo una gráfica tipo barra horizontal apilada que mostrará la proporción de cada categoría para el año más reciente"
            className="graphinfo2"
            tooltip="¿Qué significa?"
            customButton
          />
          )
        )}
        <div>
          <h6>
            Huella humana actual
          </h6>
          <h5>
            {hfCurrentValue}
          </h5>
        </div>
        <h6>
          Natural, Baja, Media y Alta
        </h6>
        <div>
          <GraphLoader
            graphType="LargeBarStackGraph"
            data={hfCurrent}
            labelX="Hectáreas"
            labelY="Huella Humana Actual"
            units="ha"
            colors={matchColor('hfCurrent')}
            padding={0.25}
            onClickGraphHandler={onClickGraphHandler}
          />
        </div>
      </div>
    );
  }
}

CurrentFootprint.propTypes = {
  onClickGraphHandler: PropTypes.func,
};

CurrentFootprint.defaultProps = {
  onClickGraphHandler: () => {},
};

export default CurrentFootprint;

CurrentFootprint.contextType = SearchContext;
