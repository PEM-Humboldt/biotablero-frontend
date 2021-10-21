import React from 'react';

import InfoIcon from '@material-ui/icons/Info';
import { IconTooltip } from 'components/Tooltips';
import GraphLoader from 'components/charts/GraphLoader';
import ShortInfo from 'components/ShortInfo';
import SearchContext from 'pages/search/SearchContext';
import RestAPI from 'utils/restAPI';
import matchColor from 'utils/matchColor';

const getFeatureLabel = {
  leaf_area: 'Área Foliar',
  leaf_nitrogen: 'Nitrógeno foliar',
  maximun_height: 'Altura Máxima',
  specific_leaf_area: 'Área Foliar Específica',
  wood_density: 'Densidad de Madera',
  seed_mass: 'Masa de Semilla',
};

const getFeatureColors = {
  leaf_area: 'functionalDFFeatureLA',
  leaf_nitrogen: 'functionalDFFeatureLN',
  maximun_height: 'functionalDFFeaturePH',
  specific_leaf_area: 'functionalDFFeatureSLA',
  wood_density: 'functionalDFFeatureSSD',
  seed_mass: 'functionalDFFeatureSM',
};

class TropicalDryForest extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
      values: {},
      features: [],
      messageValues: 'loading',
      messageFeatures: 'loading',
      selected: null,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
    } = this.context;

    RestAPI.requestDryForestValues(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({
            values: res,
            messageValues: null,
          });
        }
      })
      .catch(() => {
        this.setState({ messageValues: 'no-data' });
      });

    RestAPI.requestDryForestFeatures(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({
            features: this.transformData(res),
            messageFeatures: null,
          });
        }
      })
      .catch(() => {
        this.setState({ messageFeatures: 'no-data' });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Transform data structure to be passed to graph component as a prop
   *
   * @param {Object} rawData raw data from RestAPI
   */
   transformData = (rawData) => {
    const tranformedData = [];
    rawData.forEach((obj) => {
      const {
        id,
        min,
        max,
        value,
      } = obj;
      tranformedData.push({
        id,
        ranges: {
          area: max,
        },
        markers: {
          value,
        },
        measures: {
          min,
          max,
        },
        title: '',
      });
    });
    return tranformedData;
  };

  /**
   * Show or hide the detailed information on each graph
   */
  toggleInfoGraph = () => {
    this.setState((prevState) => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  render() {
    const {
      showInfoGraph,
      messageValues,
      messageFeatures,
      values,
      features,
      selected,
    } = this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Acerca de esta sección">
            <InfoIcon
              className="graphinfo"
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
        </h2>
        {showInfoGraph && (
          <ShortInfo
            name="Plantas del bosque seco"
            description="Plantas del bosque seco"
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        {messageValues === 'no-data' && (
          <div className="errorData">
            Información no disponible
          </div>
        )}
        <h3>Haga click en un valor o rasgo para visualizar su mapa</h3>
        {messageValues !== 'no-data' && (
          <div>
            <h6>
              Riqueza
            </h6>
            <h5 style={{ backgroundColor: matchColor('functionalDryForestValues')('value') }}>
              {values.richness}
            </h5>
            <h5 style={{ backgroundColor: matchColor('functionalDryForestValues')('value_nal') }}>
              {values.richness_nal}
            </h5>
            <br />
            <h6>
              Uniformidad
            </h6>
            <h5 style={{ backgroundColor: matchColor('functionalDryForestValues')('value') }}>
              {values.uniformity}
            </h5>
            <h5 style={{ backgroundColor: matchColor('functionalDryForestValues')('value_nal') }}>
              {values.uniformity_nal}
            </h5>
            <br />
            <h6>
              Divergencia
            </h6>
            <h5 style={{ backgroundColor: matchColor('functionalDryForestValues')('value') }}>
              {values.divergence}
            </h5>
            <h5 style={{ backgroundColor: matchColor('functionalDryForestValues')('value_nal') }}>
              {values.divergence_nal}
            </h5>
          </div>
        )}
        Valor nacional
        <br />
        <div>
          <h6>
            Rasgos funcionales
          </h6>
          <br />
          <br />
          {messageFeatures === 'no-data' && (
            <GraphLoader
              message={messageFeatures}
              data={[]}
              graphType="singleBullet"
            />
          )}
          {features.map((bar) => (
            <div key={bar.id}>
              <div
                className={`nos-title${bar.id === selected ? ' selected' : ''}`}
              >
                {getFeatureLabel[bar.id]}
              </div>
              <div className="svgPointer">
                <GraphLoader
                  message={messageFeatures}
                  data={bar}
                  graphType="singleBullet"
                  colors={matchColor(getFeatureColors[bar.id])}
                  onClickGraphHandler={() => {
                    this.setState({ selected: bar.id });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default TropicalDryForest;

TropicalDryForest.contextType = SearchContext;
