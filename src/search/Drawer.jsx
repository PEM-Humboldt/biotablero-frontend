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
        currentHF: [],
        hfPersistence: [],
        hfTimeline: [],
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

    RestAPI.requestCurrentHF()
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            currentHF: res,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            currentHF: false,
          },
        }));
      });

    RestAPI.requestHFPersistence()
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            hfPersistence: res,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            hfPersistence: false,
          },
        }));
      });

    RestAPI.requestHFTimeline()
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            hfTimeline: res,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            hfTimeline: false,
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
      geofence,
      subLayerData,
      colorSZH,
      classes,
      handlerBackButton,
      subLayerName,
      area,
      matchColor,
      hFPSelection,
      setHFPSelection,
    } = this.props;
    const {
      data: {
        fc,
        biomas,
        distritos,
        coverage,
        areaPA,
        areaSE,
        generalArea,
        currentHF,
        hfPersistence,
        hfTimeline,
      },
    } = this.state;
    const ecosystemsArea = (areaSE && areaSE[0] ? Number(areaSE[0].area).toFixed(2) : 0);
    const protectedArea = (areaPA && areaPA[0] ? Number(areaPA[0].area).toFixed(2) : 0);
    const componentsArray = [
      {
        label: {
          id: 'FC y Biomas',
          name: 'Factor de compensación',
          disabled: false,
          expandIcon: <AddIcon />,
          detailId: 'Factor de compensación en área de consulta',
          description: 'Representa el coeficiente de relación entre BiomasIAvH y regiones bióticas',
        },
        component: <CompensationFactor
          areaName={area.name}
          biomesData={biomas}
          bioticRegionsData={distritos}
          compensationFactorData={fc}
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
            selection={hFPSelection}
            setSelection={setHFPSelection}
            currentHF={currentHF}
            hfPersistence={hfPersistence}
            hfTimeline={hfTimeline}
          />
        ),
      },
    ];
    return (
      <div className="informer">
        <div className="drawer_header">
          <button
            className="geobtn"
            type="button"
            onClick={handlerBackButton}
          >
            <BackIcon />
          </button>
          {/* TODO: when replacing for actual value, it must be without decimals */}
          <div>hectáreas totales 5,306,866 ha</div>
        </div>
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
                    coverage={coverage}
                    areaId={area.id}
                    geofenceId={area.id === 'pa' ? geofence.name : geofence.id}
                    matchColor={matchColor}
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
  colorSZH: PropTypes.array,
  geofence: PropTypes.object,
  handlerBackButton: PropTypes.func,
  subLayerData: PropTypes.array,
  subLayerName: PropTypes.string,
  matchColor: PropTypes.func,
  hFPSelection: PropTypes.string.isRequired,
  setHFPSelection: PropTypes.func.isRequired,
};

Drawer.defaultProps = {
  colorSZH: [],
  geofence: { id: NaN, name: '' },
  subLayerData: {},
  subLayerName: '',
  handlerBackButton: () => {},
  matchColor: () => {},
};

export default withStyles(styles)(Drawer);
