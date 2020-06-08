import React from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';
import GraphLoader from '../charts/GraphLoader';
import matchColor from '../commons/matchColor';

class CurrentFootprint extends React.Component {
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
    const { data } = this.props;
    const { showInfoGraph } = this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <InfoIcon
            className="graphinfo"
            data-tooltip
            title="¿Qué significa este gráfico?"
            onClick={() => {
              this.toggleInfoGraph();
            }}
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
        <h6>
          Natural, Baja, Media y Alta
        </h6>
        <div>
          <GraphLoader
            graphType="LargeBarStackGraph"
            data={data}
            labelX="Hectáreas"
            labelY="Huella Humana Actual"
            units="ha"
            colors={matchColor('currentHFP')}
            padding={0.25}
          />
        </div>
      </div>
    );
  }
}

CurrentFootprint.propTypes = {
  data: PropTypes.array.isRequired,
};

export default CurrentFootprint;
