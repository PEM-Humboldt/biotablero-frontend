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
      geofenceArea: 0,
    };
  }

  componentDidMount() {
    const {
      geofence, area,
    } = this.props;

    const searchId = geofence.id || geofence.name;

    RestAPI.requestGeofenceDetails(area.id, searchId)
      .then((res) => {
        this.setState({ geofenceArea: Number(res.total_area) });
      })
      .catch(() => {});
  }

  render() {
    const {
      geofence,
      handlerBackButton,
      area,
      matchColor,
      handlerShutOffAllLayers,
      handlerSwitchLayer,
      handlerClickOnGraph,
    } = this.props;

    const {
      geofenceArea,
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
              <b>{`${numberWithCommas(geofenceArea.toFixed(0))} ha`}</b>
            </h4>
          </div>
        </div>
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
              generalArea={Number(geofenceArea)}
              areaId={area.id}
              geofenceId={area.id === 'pa' ? geofence.name : geofence.id}
              matchColor={matchColor}
            />
          </div>
          <div>
            <Landscape
              areaId={area.id}
              geofenceId={area.id === 'pa' ? geofence.name : geofence.id}
              matchColor={matchColor}
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
        {/* // TODO: This functionality should be implemented again
          (
          <div className={classes.root}>
            <RenderGraph
              graph="BarVertical"
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
  area: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  geofence: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    name: PropTypes.string,
  }).isRequired,
  handlerBackButton: PropTypes.func,
  matchColor: PropTypes.func,
  handlerShutOffAllLayers: PropTypes.func,
  handlerSwitchLayer: PropTypes.func,
  handlerClickOnGraph: PropTypes.func,
};

Drawer.defaultProps = {
  handlerBackButton: () => {},
  matchColor: () => {},
  handlerShutOffAllLayers: () => {},
  handlerSwitchLayer: () => {},
  handlerClickOnGraph: () => {},
};

export default withStyles(styles)(Drawer);
