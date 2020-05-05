import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/FirstPage';
import Ecosistemas from '@material-ui/icons/Nature';
import Especies from '@material-ui/icons/FilterVintage';
import Paisaje from '@material-ui/icons/FilterHdr';
import AddIcon from '@material-ui/icons/Add';
import RestAPI from '../api/RestAPI';
import Overview from '../strategicEcosystems/Overview';
import CompensationFactor from './CompensationFactor';
import HumanFootprint from './HumanFootprint';
import RenderGraph from '../charts/RenderGraph';
import TabContainer from '../commons/TabContainer';
import { setPAValues, setCoverageValues } from '../strategicEcosystems/FormatSE';

import Accordion from '../commons/Accordion';

const colorsRB = ['#003d59',
  '#5a1d44',
  '#902130',
  '#6d819c',
  '#db9d6b',
  '#fb9334',
  '#fe6625',
  '#ab5727',
  '#44857d',
  '#167070'];

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
        generalArea: 0, // general area value in the current geofence
      },
    };
  }

  componentWillMount() {
    this.setState(null);
  }

  componentDidMount() {
    const {
      geofence, area,
    } = this.props;
    const searchId = geofence.id || geofence.name;

    RestAPI.requestGeofenceDetails(area.id, searchId)
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            generalArea: Number(res.total_area),
          },
        }));
      })
      .catch(() => {
      });


    RestAPI.requestCoverage(area.id, searchId)
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            coverage: setCoverageValues(res),
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
            areaPA: setPAValues(res),
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

    if (area.id === 'ea') {
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
  }

  render() {
    const {
      geofence, subLayerData, colors, colorSZH, colorsFC,
      classes, handlerBackButton, handlerInfoGraph, openInfoGraph,
      subLayerName, area, matchColor,
    } = this.props;
    console.log('Drawer matchColor', matchColor);
    const {
      data: {
        fc, biomas, distritos, coverage, areaPA, areaSE, generalArea,
      },
    } = this.state;
    const ecosystemsArea = (areaSE && areaSE[0] ? Number(areaSE[0].area).toFixed(2) : 0);
    const protectedArea = (areaPA && areaPA[0] ? Number(areaPA[0].area).toFixed(2) : 0);
    const componentsArray = [{
      label: {
        id: 'Factor de compensación',
        name: 'Factor de compensación',
        disabled: false,
        expandIcon: <AddIcon />,
        detailId: 'Factor de compensación en área de consulta',
        description: 'Representa el coeficiente de relación entre BiomasIAvH y regiones bióticas',
      },
      component: <CompensationFactor
        areaName={area.name}
        biomesColors={colors}
        biomesData={biomas}
        bioticRegionsColors={colorsRB}
        bioticRegionsData={distritos}
        compensationFactorColors={colorsFC}
        compensationFactorData={fc}
        handlerInfoGraph={handlerInfoGraph}
        openInfoGraph={openInfoGraph}
        matchColor={matchColor}
      />,
    },
    {
      label: {
        id: 'Huella humana',
        name: 'Huella humana',
        disabled: false,
        expandIcon: <AddIcon />,
        detailId: 'Huella humana en el área',
        description: 'Representa diferentes análisis de huella humana en esta área de consulta',
      },
      component: (
        <HumanFootprint
          generalArea={generalArea}
          geofence={geofence}
        />
      ),
    },
    ];
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
          {`${area.name} /`}
          <br />
          {geofence.name}
          <b>
            {subLayerName}
          </b>
        </h1>
        { !subLayerName && (
          <TabContainer
            initialSelectedIndex={0}
            classes={classes}
            titles={[
              { label: 'Ecosistemas', icon: (<Ecosistemas />) },
              { label: 'Paisaje', icon: (<Paisaje />) },
              { label: 'Especies', icon: (<Especies />) },
            ]}
          >
            {[
              (
                <div key="2">
                  <Overview
                    generalArea={Number(generalArea)}
                    ecosystemsArea={Number(ecosystemsArea)}
                    // First element removed, which is the total area in SE
                    listSE={(areaSE ? areaSE.slice(1) : areaSE)}
                    protectedArea={Number(protectedArea)}
                    // First element removed, which is the total area in PA
                    listPA={(areaPA ? areaPA.slice(1) : areaPA)}
                    // First element removed, which is the total area in the selected area
                    coverage={(coverage && (coverage[0].type === 'Total') ? coverage.slice(1) : coverage)}
                    handlerInfoGraph={handlerInfoGraph}
                    openInfoGraph={openInfoGraph}
                    areaId={area.id}
                    geofenceId={area.id === 'pa' ? geofence.name : geofence.id}
                    graphTitle="Área"
                    graphDescription={
                      'resume la información de los ecosistemas presentes en el'
                      + ' área seleccionada, y su distribución al interior de áreas protegidas'
                      + ' y ecosistemas estratégicos. Nota: Aquellos valores inferiores al 1%'
                      + ' no son representados en las gráficas.'
                      }
                  />
                </div>
              ),
              (
                <div key="1" selected>
                  <Accordion
                    componentsArray={componentsArray}
                  />
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
        { subLayerName && subLayerData && (
          <div className={classes.root}>
            <RenderGraph
              graph="BarVertical"
              data={subLayerData}
              graphTitle="ha por Subzonas Hidrográficas"
              colors={colorSZH}
              labelX="Subzonas Hidrográficas"
              labelY="Hectáreas"
              units="ha"
            />
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
  geofence: PropTypes.object,
  handlerBackButton: PropTypes.func,
  handlerInfoGraph: PropTypes.func,
  openInfoGraph: PropTypes.string,
  subLayerData: PropTypes.array,
  subLayerName: PropTypes.string,
  matchColor: PropTypes.any,
};

Drawer.defaultProps = {
  colors: ['#345b6b'],
  colorSZH: [],
  colorsFC: [],
  geofence: { id: NaN, name: '' },
  subLayerData: {},
  subLayerName: '',
  handlerBackButton: () => {},
  handlerInfoGraph: () => {},
  openInfoGraph: null,
  matchColor: null,
};

export default withStyles(styles)(Drawer);
