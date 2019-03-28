/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/FirstPage';
import RestAPI from '../api/RestAPI';

const styles = () => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});

class NationalInsigths extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      data: {
        moor: null, // moor data
        wetland: null, // wetland data
        tdforest: null, // tropical dry forest area
      },
    };
  }

  componentDidMount() {
    RestAPI.requestStrategicEcosystems()
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            moor: res,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            moor: false,
          },
        }));
      });

    RestAPI.requestNationalTDForest('national')
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            tdforest: res,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            tdforest: false,
          },
        }));
      });

    RestAPI.requestNationalWetland('national')
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            wetland: res,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            wetland: false,
          },
        }));
      });
  }

  render() {
    const {
      colors, handlerBackButton,
    } = this.props;
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
          {'Estadísticas Nacionales'}
          <br />
        </h1>
        {// TODO: RenderGraph call
        }
      </div>
    );
  }
}

NationalInsigths.propTypes = {
  colors: PropTypes.array,
  handlerBackButton: PropTypes.func,
};

NationalInsigths.defaultProps = {
  colors: ['#345b6b'],
  handlerBackButton: () => {},
};

export default withStyles(styles)(NationalInsigths);
