import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/FirstPage';
import Ecosistemas from '@material-ui/icons/Nature';
import Especies from '@material-ui/icons/FilterVintage';
import Paisaje from '@material-ui/icons/FilterHdr';

import RestAPI from '../api/RestAPI';
import Overview from '../strategicEcosystems/Overview';
import TabContainer from '../commons/TabContainer';
import Landscape from '../landscape/Landscape';

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
        generalArea: 0,
        hfCurrent: [],
        hfCurrentValue: 0,
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
      .catch(() => {});

    RestAPI.requestCurrentHF()
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            hfCurrent: res,
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
        const hfCurrentValue = Number(aTotalData.find(o => Number(o.x) === maxYear).y);
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            hfTimeline: res,
            hfCurrentValue,
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
  }

  render() {
    const {
      geofence,
      hfTimelineArea,
      handlerBackButton,
      subLayerName,
      area,
      matchColor,
      handlerShutOffAllLayers,
      handlerSwitchLayer,
      handlerClickOnGraph,
    } = this.props;
    const {
      data: {
        generalArea,
        hfCurrent,
        hfCurrentValue,
        hfPersistence,
        hfTimeline,
      },
    } = this.state;
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
            titles={[
              { label: 'Ecosistemas', icon: (<Ecosistemas />) },
              { label: 'Paisaje', icon: (<Paisaje />) },
              { label: 'Especies', icon: (<Especies />) },
            ]}
            handlerShutOffAllLayers={handlerShutOffAllLayers}
          >
            <div>
              <Overview
                generalArea={Number(generalArea)}
                areaId={area.id}
                geofenceId={area.id === 'pa' ? geofence.name : geofence.id}
                matchColor={matchColor}
              />
            </div>
            <div>
              <Landscape
                hfCurrent={hfCurrent}
                hfCurrentValue={hfCurrentValue}
                hfPersistence={hfPersistence}
                hfTimeline={hfTimeline}
                area={area}
                geofence={geofence}
                matchColor={matchColor}
                hfTimelineArea={hfTimelineArea}
                handlerSwitchLayer={handlerSwitchLayer}
                handlerClickOnGraph={handlerClickOnGraph}
              />
            </div>
            <div className="graphcard">
              <h2>
                Gráficas en construcción
              </h2>
              <p>
                Pronto más información
              </p>
            </div>
          </TabContainer>
        )}
        {/* // TODO: This functionality should be implemented again
          subLayerName && hfTimelineArea && (
          <div className={classes.root}>
            <RenderGraph
              graph="BarVertical"
              data={hfTimelineArea}
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
  geofence: PropTypes.object,
  handlerBackButton: PropTypes.func,
  hfTimelineArea: PropTypes.object,
  subLayerName: PropTypes.string,
  matchColor: PropTypes.func,
  handlerShutOffAllLayers: PropTypes.func,
  handlerSwitchLayer: PropTypes.func,
  handlerClickOnGraph: PropTypes.func,
};

Drawer.defaultProps = {
  geofence: { id: NaN, name: '' },
  hfTimelineArea: {},
  subLayerName: '',
  handlerBackButton: () => {},
  matchColor: () => {},
  handlerShutOffAllLayers: () => {},
  handlerSwitchLayer: () => {},
  handlerClickOnGraph: () => {},
};

export default withStyles(styles)(Drawer);
