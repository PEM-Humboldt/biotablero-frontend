/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/FirstPage';
import Ecosistemas from '@material-ui/icons/Nature';
import Especies from '@material-ui/icons/FilterVintage';
import Paisaje from '@material-ui/icons/FilterHdr';
import RestAPI from '../api/RestAPI';
import Overview from '../strategicEcosystems/Overview';

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
    const searchId = geofence.id || geofence.name;

    RestAPI.requestCoverage(area.id, searchId)
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

    RestAPI.requestProtectedAreas(area.id, searchId)
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

    RestAPI.requestStrategicEcosystems(area.id, searchId)
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            areaSE: res,
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

    RestAPI.requestBiomes(area.id, searchId)
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

    RestAPI.requestCompensationFactor(area.id, searchId)
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

    RestAPI.requestBioticUnits(area.id, searchId)
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

  setListSE = data => (
    // TODO: Implement handlerSE, selectedSE
    data ? data.slice(1, data.length) : data
  );

  render() {
    const {
      geofence, geofenceData, colors, colorSZH, colorsFC,
      classes, handlerBackButton, handlerInfoGraph, openInfoGraph,
      layerName, area,
    } = this.props;
    const {
      data: {
        fc, biomas, distritos, coverage, areaPA, areaSE,
      },
    } = this.state;
    const generalSE = (areaSE ? areaSE[0] : areaSE);
    const listSE = this.setListSE(areaSE);
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
                  {RenderGraph(fc, 'Hectáreas', 'F C', 'BarStackGraph',
                    'Factor de Compensación', colorsFC, handlerInfoGraph, openInfoGraph,
                    'representa las hectáreas sobre los Biomas IAvH analizados')}
                  {RenderGraph(biomas, 'Hectáreas', 'Biomas', 'BarStackGraph',
                    'Biomas', colors, handlerInfoGraph, openInfoGraph,
                    'agrupa los biomas definidos a nivel nacional y presentes en esta área de consulta')}
                  {RenderGraph(distritos, 'Hectáreas', 'Regiones Bióticas', 'BarStackGraph',
                    'Regiones Bióticas', ['#92ba3a', '#70b438', '#5f8f2c'], handlerInfoGraph, openInfoGraph,
                    'muestra las hectáreas por cada región biótica en el área de consulta seleccionada')}
                </div>
              ),
              (
                <div key="2">
                  {Overview(generalSE, listSE, areaPA, coverage,
                    handlerInfoGraph, openInfoGraph, area.id, geofence.id)}
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
  area: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  colors: PropTypes.array,
  colorSZH: PropTypes.array,
  colorsFC: PropTypes.array,
  geofenceData: PropTypes.array,
  geofence: PropTypes.object,
  handlerBackButton: PropTypes.func,
  handlerInfoGraph: PropTypes.func,
  openInfoGraph: PropTypes.string,
  layerName: PropTypes.string,
};

Drawer.defaultProps = {
  colors: ['#345b6b'],
  colorSZH: [],
  colorsFC: [],
  geofenceData: {},
  geofence: { id: NaN, name: '' },
  layerName: '',
  handlerBackButton: () => {},
  handlerInfoGraph: () => {},
  openInfoGraph: null,
};

export default withStyles(styles)(Drawer);
