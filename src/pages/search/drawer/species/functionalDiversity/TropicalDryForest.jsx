import React from 'react';

import InfoIcon from '@mui/icons-material/Info';
import { IconTooltip } from 'pages/search/shared_components/Tooltips';
import ShortInfo from 'components/ShortInfo';
import SearchContext from 'pages/search/SearchContext';
import RestAPI from 'utils/restAPI';
import matchColor from 'utils/matchColor';
import Bullet from 'pages/search/shared_components/charts/Bullet';

const getFeatureLabel = {
  leaf_area: { __html: '<div>Área Foliar (mm<sup>2</sup>)</div>' },
  leaf_nitrogen: { __html: '<div>Nitrógeno foliar (%)</div>' },
  maximun_height: { __html: '<div>Altura Máxima (m)</div>' },
  specific_leaf_area: { __html: '<div>Área Foliar Específica (mg/mm<sup>2</sup>)</div>' },
  wood_density: { __html: '<div>Densidad de Madera (g/cm<sup>3</sup>)</div>' },
  seed_mass: { __html: '<div>Masa de Semilla (g)</div>' },
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
      showInfoGraph: true,
      values: {},
      features: [],
      messageValues: 'loading',
      messageFeatures: 'loading',
      selected: 'richness',
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
      switchLayer,
    } = this.context;

    switchLayer('tropicalDryForest');

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
            description={`<p>Plantas del bosque seco</p>`}
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
          <div className="svgPointer2">
            <div
              onClick={() => {
                this.setState({ selected: 'richness' });
              }}
              onKeyDown={() => {
                this.setState({ selected: 'richness' });
              }}
              role="button"
              tabIndex={0}
            >
              <h6 className={selected === 'richness' ? 'h6Selected' : null}>
                Riqueza
              </h6>
              <h5 style={{ backgroundColor: matchColor('functionalDryForestValues')('value') }}>
                {values.richness}
              </h5>
              <h5 style={{ backgroundColor: matchColor('functionalDryForestValues')('value_nal') }}>
                {values.richness_nal}
              </h5>
            </div>
            <div
              onClick={() => {
                this.setState({ selected: 'uniformity' });
              }}
              onKeyDown={() => {
                this.setState({ selected: 'uniformity' });
              }}
              role="button"
              tabIndex={0}
            >
              <h6 className={selected === 'uniformity' ? 'h6Selected' : null}>
                Uniformidad
              </h6>
              <h5 style={{ backgroundColor: matchColor('functionalDryForestValues')('value') }}>
                {values.uniformity}
              </h5>
              <h5 style={{ backgroundColor: matchColor('functionalDryForestValues')('value_nal') }}>
                {values.uniformity_nal}
              </h5>
            </div>
            <div
              onClick={() => {
                this.setState({ selected: 'divergency' });
              }}
              onKeyDown={() => {
                this.setState({ selected: 'divergency' });
              }}
              role="button"
              tabIndex={0}
            >
              <h6 className={selected === 'divergency' ? 'h6Selected' : null}>
                Divergencia
              </h6>
              <h5 style={{ backgroundColor: matchColor('functionalDryForestValues')('value') }}>
                {values.divergence}
              </h5>
              <h5 style={{ backgroundColor: matchColor('functionalDryForestValues')('value_nal') }}>
                {values.divergence_nal}
              </h5>
            </div>
            <div className="p-label">
              <div style={{ color: matchColor('functionalDryForestValues')('value') }}>
                Valor área de consulta
              </div>
              <div style={{ color: matchColor('functionalDryForestValues')('value_nal') }}>
                {' Valor nacional'}
              </div>
            </div>
          </div>
        )}
        <div>
          <h6>
            Rasgos funcionales
          </h6>
          <h3>
            Los valores de las barras van del mínimo al máximo nacional
          </h3>
          <br />
          {messageFeatures === 'no-data' && (
            <Bullet
              message={messageFeatures}
              data={[]}
              graphType="Bullet"
            />
          )}
          {features.map((bar) => (
            <div key={bar.id}>
              <div
                className={`nos-title${bar.id === selected ? ' selected' : ''}`}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={getFeatureLabel[bar.id]}
              />
              <div className="svgPointer">
                <Bullet
                  message={messageFeatures}
                  data={bar}
                  graphType="Bullet"
                  colors={matchColor(getFeatureColors[bar.id])}
                  onClickHandler={() => {
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
