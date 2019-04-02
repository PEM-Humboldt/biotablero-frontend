/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/FirstPage';
import Ecosistemas from '@material-ui/icons/Nature';
import Especies from '@material-ui/icons/FilterVintage';
import Paisaje from '@material-ui/icons/FilterHdr';
import RestAPI from '../api/RestAPI';

import RenderGraph from '../charts/RenderGraph';
import TabContainer from '../commons/TabContainer';

const styles = () => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});

class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      data: {
        biomas: null,
        distritos: null,
        fc: null,
        coverage: null, // coverage area
        areaSE: null, // area fields for strategic ecosystems
        areaPA: null, // area fields for protected areas
      },
    };
  }

  componentDidMount() {
    const {
      geofence, area,
    } = this.props;

    RestAPI.requestCoverage(area.id, geofence.id)
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            coverage: res,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            coverage: false,
          },
        }));
      });

    RestAPI.requestProtectedAreas(area.id, geofence.id)
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            areaPA: res,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            areaPA: false,
          },
        }));
      });

    RestAPI.requestStrategicEcosystems(geofence.id)
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            areaSE: res.pa,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            areaSE: false,
          },
        }));
      });

    RestAPI.requestBiomes(area.id, geofence.id)
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            biomas: res,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            biomas: false,
          },
        }));
      });

    RestAPI.requestCompensationFactor(area.id, geofence.id)
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            fc: res,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            fc: false,
          },
        }));
      });

    RestAPI.requestBioticUnits(area.id, geofence.id)
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            distritos: res,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            distritos: false,
          },
        }));
      });
  }

  render() {
    const {
      geofence, geofenceData, colors, colorSZH, colorsFC,
      classes, handlerBackButton, layerName, area,
    } = this.props;
    const {
      data: {
        fc, biomas, distritos, coverage, areaPA, areaSE,
      },
    } = this.state;
    return (
      <div className="informer">
        <button
          className="geobtn"
          type="button"
          onClick={handlerBackButton}
        >
          <BackIcon />
        </button>
        <div className="iconsection mt2" />
        <h1>
          {`${area.name} / ${geofence.name}`}
          <br />
          <b>
            {layerName}
          </b>
        </h1>
        { !layerName && (
          <TabContainer
            classes={classes}
            titles={[
              { label: 'Paisaje', icon: (<Paisaje />) },
              { label: 'Ecosistemas', icon: (<Ecosistemas />) },
              { label: 'Especies', icon: (<Especies />) },
            ]}
          >
            {[
              (
                <div key="1">
                  {RenderGraph(fc, 'Hectáreas', 'F C', 'BarStackHorizontal', 'Factor de Compensación', colorsFC)}
                  {RenderGraph(biomas, 'Hectáreas', 'Biomas', 'BarStackHorizontal', 'Biomas', colors)}
                  {RenderGraph(distritos, 'Hectáreas', 'Regiones Bióticas', 'BarStackHorizontal', 'Regiones Bióticas', colors)}
                </div>
              ),
              (
                <div key="2">
                  {// this.renderGraph(areaSE, 'Tipo de ecosistema', 'Hectáreas',
                  // 'BarVertical', 'Área (ha) por ecosistema estratégico', colors)
                  }
                  {RenderGraph(areaSE, 'Tipo de ecosistema', '% de ha totales',
                    'BarVertical', '% ha - Ecosistemas Estratégicos', colorsFC, '%', true)
                  }
                  {RenderGraph(areaPA, 'Tipo de ecosistema', '% de ha totales',
                    'BarVertical', '% ha - Áreas protegidas', colorsFC, '%', true)
                  }
                  {RenderGraph(coverage, 'Tipo de ecosistema', '% de ha totales',
                    'BarVertical', '% ha - Cambio de cobertura', colorsFC, '%', true)
                  }
                </div>
              ),
              (
                <div className="graphcard" key="3">
                  <h2>
                    Gráficas en construcción
                  </h2>
                  <p>
                    Pronto más información
                  </p>
                </div>
              ),
            ]}
          </TabContainer>
        )}
        { layerName && geofenceData && (
          <div className={classes.root}>
            {RenderGraph(geofenceData, 'Subzonas Hidrográficas', 'Hectáreas',
              'BarVertical', 'ha por Subzonas Hidrográficas', colorSZH, 'ha', false)}
          </div>
        )}
      </div>
    );
  }
}

Drawer.propTypes = {
  geofenceData: PropTypes.array,
  geofence: PropTypes.object,
  colors: PropTypes.array,
  classes: PropTypes.object.isRequired,
  handlerBackButton: PropTypes.func,
  layerName: PropTypes.string,
  area: PropTypes.object.isRequired,
  colorSZH: PropTypes.array,
  colorsFC: PropTypes.array,
};

Drawer.defaultProps = {
  geofenceData: {},
  geofence: { id: NaN, name: '' },
  colors: ['#345b6b'],
  layerName: '',
  handlerBackButton: () => {},
  colorSZH: [],
  colorsFC: [],
};

export default withStyles(styles)(Drawer);
