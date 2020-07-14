import React from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';
import GraphLoader from '../charts/GraphLoader';
import matchColor from '../commons/matchColor';

const getLabel = {
  estable_natural: 'Estable Natural',
  dinamica: 'Dinámica',
  estable_alta: 'Estable Alta',
};

class PersistenceFootprint extends React.Component {
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

  render() {
    const { data, onClickGraphHandler } = this.props;
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
            name="Persistencia Huella Humana"
            description="Barra horizontal del mismo tipo a la de la sección 1 (o a las barras horizontales existentes en BioTablero) que muestra el área total de la unidad de consulta distribuida en los diferentes valores de persistencia"
            className="graphinfo2"
            tooltip="¿Qué significa?"
            customButton
          />
          )
        )}
        <h6>
          Estable natural, Dinámica, Estable alta
        </h6>
        <div>
          <GraphLoader
            graphType="LargeBarStackGraph"
            data={data.map(item => ({
              ...item,
              label: getLabel[item.key],
            }))}
            labelX="Hectáreas"
            labelY="Persistencia Huella Humana"
            units="ha"
            colors={matchColor('persistenceHFP')}
            padding={0.25}
            onClickGraphHandler={onClickGraphHandler}
          />
        </div>
      </div>
    );
  }
}

PersistenceFootprint.propTypes = {
  data: PropTypes.array.isRequired,
  onClickGraphHandler: PropTypes.func,
};

PersistenceFootprint.defaultProps = {
  onClickGraphHandler: () => {},
};

export default PersistenceFootprint;
