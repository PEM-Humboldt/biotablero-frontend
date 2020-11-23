import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/FirstPage';
import Ecosistemas from '@material-ui/icons/Nature';
import Especies from '@material-ui/icons/FilterVintage';
import Paisaje from '@material-ui/icons/FilterHdr';

import Landscape from '../landscape/Landscape';
import Overview from '../strategicEcosystems/Overview';
import RestAPI from '../api/RestAPI';
import SearchContext from '../SearchContext';
import TabContainer from '../commons/TabContainer';
import formatNumber from '../commons/format';

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
    handlerSwitchLayer('geofence');

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
            <Overview
              generalArea={Number(geofenceArea)}
            />
          </div>
          <div>
            <Landscape
              handlerSwitchLayer={handlerSwitchLayer}
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
