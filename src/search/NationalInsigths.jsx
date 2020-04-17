/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/FirstPage';
import RestAPI from '../api/RestAPI';
import RenderGraph from '../charts/RenderGraph';

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
        national: null, // national data
        pa: null, // protected areas data
        coverage: null, // coverage area
      },
    };
  }

  componentDidMount() {
    const {
      geofence,
    } = this.props;
    RestAPI.requestNationalSE(geofence)
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            national: res,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            national: false,
          },
        }));
      });

    RestAPI.requestNationalCoverage(geofence)
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

    RestAPI.requestNationalPA(geofence)
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            pa: res,
          },
        }));
      })
      .catch(() => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            pa: false,
          },
        }));
      });
  }

  render() {
    const { data } = this.state;
    const {
      area, colors, geofence, handlerBackButton, handlerInfoGraph,
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
          {`${area.name} /`}
          <br />
          {`${geofence}`}
        </h1>
        <div>
          {(data.national)
            && (
            <RenderGraph
              graph="DotInfo"
              data={data.national}
              graphTitle="Nacional"
              colors={null}
              labelX={null}
              labelY={null}
              handlerInfoGraph={handlerInfoGraph}
              openInfoGraph={false}
              units="ha"
            />
            )
          }
          {(data.coverage)
            && (
            <RenderGraph
              graph="BarVertical"
              data={data.coverage}
              graphTitle="Tipo de cobertura"
              colors={colors}
              labelX="Cobertura"
              labelY="Hectáreas"
              openInfoGraph={false}
              units="ha"
            />
            )
          }
          {(data.pa)
            && (
            <RenderGraph
              graph="BarVertical"
              data={data.pa}
              graphTitle="Tipo de áreas protegidas"
              colors={colors}
              labelX="Área protegida"
              labelY="Hectáreas"
              openInfoGraph={false}
              units="ha"
            />
            )
          }
        </div>
      </div>
    );
  }
}

NationalInsigths.propTypes = {
  area: PropTypes.object.isRequired,
  colors: PropTypes.array,
  geofence: PropTypes.string,
  handlerBackButton: PropTypes.func,
  handlerInfoGraph: PropTypes.func,
};

NationalInsigths.defaultProps = {
  colors: ['#345b6b'],
  geofence: '',
  handlerBackButton: () => {},
  handlerInfoGraph: () => {},
};

export default withStyles(styles)(NationalInsigths);
