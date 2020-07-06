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
import TabContainer from '../commons/TabContainer';
import Accordion from '../commons/Accordion';

const styles = () => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      data: {
        biomas: null,
        distritos: null,
        fc: null,
        coverage: null,
        areaSE: null,
        areaPA: null,
        generalArea: 0,
        currentHF: [],
        currentHFPValue: 0,
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

    RestAPI.requestSEDetails(area.id, searchId)
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            areaSE: res,
          },
        }));
      })
      .catch(() => {});

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
      .catch(() => {});

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
        const aTotalData = res.find(o => o.key === 'aTotal').data;
        const maxYear = Math.max(...aTotalData.map(o => Number(o.x)));
        const currentHFPValue = Number(aTotalData.find(o => Number(o.x) === maxYear).y);
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            hfTimeline: res,
            currentHFPValue,
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
      timelineHFPArea,
      classes,
      handlerBackButton,
      subLayerName,
      area,
      matchColor,
      handlersGeometry,
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
        currentHFPValue,
        hfPersistence,
        hfTimeline,
      },
    } = this.state;
    const componentsArray = [
      {
        label: {
          id: 'fc',
          name: 'FC y Biomas',
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
          id: 'hfp',
          name: 'Huella humana',
          disabled: false,
          expandIcon: <AddIcon />,
          detailId: 'Huella humana en el área',
          description: 'Representa diferentes análisis de huella humana en esta área de consulta',
        },
        component: (
          <HumanFootprint
            currentHF={currentHF}
            currentHFPValue={currentHFPValue}
            hfPersistence={hfPersistence}
            hfTimeline={hfTimeline}
            handlersGeometry={handlersGeometry}
            timelineHFPArea={timelineHFPArea}
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
          <div className="HAgen">
            <h4>
              hectáreas totales
              <b>{`${numberWithCommas(generalArea.toFixed(0))} ha`}</b>
            </h4>
          </div>
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
                    listSE={areaSE}
                    listPA={areaPA}
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
                    handlersGeometry={handlersGeometry}
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
        {/* // TODO: This functionality should be implemented again
          subLayerName && timelineHFPArea && (
          <div className={classes.root}>
            <RenderGraph
              graph="BarVertical"
              data={timelineHFPArea}
              graphTitle="ha por Subzonas Hidrográficas"
              colors={colorSZH}
              labelX="Subzonas Hidrográficas"
              labelY="Hectáreas"
              units="ha"
            />
          </div>
        ) */}
      </div>
    );
  }
}

Drawer.propTypes = {
  area: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  geofence: PropTypes.object,
  handlerBackButton: PropTypes.func,
  timelineHFPArea: PropTypes.object,
  subLayerName: PropTypes.string,
  matchColor: PropTypes.func,
  handlersGeometry: PropTypes.arrayOf(PropTypes.func),
};

Drawer.defaultProps = {
  geofence: { id: NaN, name: '' },
  timelineHFPArea: {},
  subLayerName: '',
  handlerBackButton: () => {},
  matchColor: () => {},
  handlersGeometry: [],
};

export default withStyles(styles)(Drawer);
