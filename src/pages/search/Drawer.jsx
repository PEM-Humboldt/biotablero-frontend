import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import BackIcon from '@mui/icons-material/FirstPage';
import Ecosistemas from '@mui/icons-material/Nature';
import Especies from '@mui/icons-material/FilterVintage';
import Paisaje from '@mui/icons-material/FilterHdr';

import SearchContext from 'pages/search/SearchContext';
import Landscape from 'pages/search/drawer/Landscape';
import Species from 'pages/search/drawer/Species';
import Ecosystems from 'pages/search/drawer/Ecosystems';
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

    const searchId = geofenceId;

    RestAPI.requestGeofenceDetails(areaId, searchId)
      .then((res) => {
        this.setState({ geofenceArea: Number(res.total_area) });
      })
      .catch(() => {});
  }

  render() {
    const { handlerBackButton } = this.props;

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
        >
          {geofenceArea !== 0 && (
            <div>
              <Ecosystems
                generalArea={Number(geofenceArea)}
              />
            </div>
          )}
          <div>
            <Landscape />
          </div>
          <div>
            <Species />
          </div>
        </TabContainer>
      </div>
    );
  }
}

Drawer.propTypes = {
  handlerBackButton: PropTypes.func,
};

Drawer.defaultProps = {
  handlerBackButton: () => {},
};

export default withStyles(styles)(Drawer);

Drawer.contextType = SearchContext;
