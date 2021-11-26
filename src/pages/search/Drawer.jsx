import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/FirstPage';
import Ecosistemas from '@material-ui/icons/Nature';
import Especies from '@material-ui/icons/FilterVintage';
import Paisaje from '@material-ui/icons/FilterHdr';

import SearchContext from 'pages/search/SearchContext';
import Landscape from 'pages/search/drawer/Landscape';
import Species from 'pages/search/drawer/Species';
import StrategicEcosystems from 'pages/search/drawer/StrategicEcosystems';
import formatNumber from 'utils/format';
import RestAPI from 'utils/restAPI';
import TabContainer from 'components/TabContainer';

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
      geofenceArea: 0,
    };
  }

  componentDidMount() {
    const {
      areaId,
      geofenceId,
    } = this.context;

    const { handlerSwitchLayer } = this.props;
    handlerSwitchLayer('coverage');

    const searchId = geofenceId;

    RestAPI.requestGeofenceDetails(areaId, searchId)
      .then((res) => {
        this.setState({ geofenceArea: Number(res.total_area) });
      })
      .catch(() => {});
  }

  render() {
    const {
      handlerBackButton,
      handlerSwitchLayer,
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
              <b>{`${formatNumber(geofenceArea, 0)} ha`}</b>
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
          handlerSwitchLayer={handlerSwitchLayer}
        >
          <div>
            <StrategicEcosystems
              generalArea={Number(geofenceArea)}
            />
          </div>
          <div>
            <Landscape
              handlerSwitchLayer={handlerSwitchLayer}
            />
          </div>
          <div>
            <Species
              handlerSwitchLayer={handlerSwitchLayer}
            />
          </div>
        </TabContainer>
      </div>
    );
  }
}

Drawer.propTypes = {
  handlerBackButton: PropTypes.func,
  handlerSwitchLayer: PropTypes.func,
};

Drawer.defaultProps = {
  handlerBackButton: () => {},
  handlerSwitchLayer: () => {},
};

export default withStyles(styles)(Drawer);

Drawer.contextType = SearchContext;
