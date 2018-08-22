import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Ecosistemas from '@material-ui/icons/Nature';
import Especies from '@material-ui/icons/FilterVintage';
import Paisaje from '@material-ui/icons/FilterHdr';
import Typography from '@material-ui/core/Typography';
import { ParentSize } from "@vx/responsive";

import ElasticAPI from '../api/elastic';
import GraphLoader from '../GraphLoader';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: "transparent",
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
      },
    };
  }

  componentDidMount() {
    ElasticAPI.requestCarByBiomaArea('CORPOBOYACA')
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            biomas: res,
          },
        }));
      });
    ElasticAPI.requestCarByFCArea('CORPOBOYACA')
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            fc: res,
          },
        }));
      });
    ElasticAPI.requestCarByDistritosArea('CORPOBOYACA')
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            distritos: res,
          },
        }));
      });
  }

  checkGraph = (data, labelX, labelY, graph, graphTitle) => {
    // While data is being retrieved from server
    if (!data) {
      return (
        <div>
          Loading data...
        </div>
      );
    }
    return (
      <ParentSize className="nocolor">
        {parent => (
          parent.width && (
            <GraphLoader
              width={parent.width}
              height={parent.height}
              graphType={graph}
              data={data}
              labelX={labelX}
              labelY={labelY}
              graphTitle={graphTitle}
            />
          )
        )}
      </ParentSize>
    );
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const {
      value, data: { fc, biomas, distritos },
    } = this.state;
    const { biomaActivo, biomaActivoData } = this.props;

    if (biomaActivo === null) {
      return (
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={this.handleChange}
              indicatorColor="secondary"
              textColor="secondary"
              centered
            >
              <Tab className="tabs" label="Paisaje" icon={<Paisaje />} />
              <Tab className="tabs" label="Ecosistemas" icon={<Ecosistemas />} />
              <Tab className="tabs" label="Especies" icon={<Especies />} />
            </Tabs>
          </AppBar>
          {value === 0 && (
            <TabContainer>
              {this.checkGraph(fc, 'Hectáreas', 'F C', 'BarStackHorizontal', 'Factor de Compensación')}
              {this.checkGraph(biomas, 'Hectáreas', 'Biomas', 'BarStackHorizontal', 'Biomas')}
              {this.checkGraph(distritos, 'Hectáreas', 'Regiones Bióticas', 'BarStackHorizontal', 'Regiones Bióticas')}
            </TabContainer>
          )}
          {value === 1 && (
            <TabContainer>
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
          {value === 2 && (
            <TabContainer>
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
        </div>
      );
    }
    if (biomaActivo !== null && biomaActivoData !== null) {
      return (
        <div className={classes.root}>
          {this.checkGraph(biomaActivoData, 'Subzonas Hidrográficas', 'Hectáreas', 'BarVertical', 'HAs por Subzonas Hidrográficas')}
        </div>
      );
    }
    return (
      <div className={classes.root}>
        {/* TODO: esto probablemente nunca se ejecute, no quemar el mensae */}
        Por favor seleccione un bioma en el mapa
      </div>
    );
  }
}

Drawer.propTypes = {
  classes: PropTypes.object.isRequired,
  biomaActivo: PropTypes.string,
  biomaActivoData: PropTypes.object,
};

Drawer.defaultProps = {
  biomaActivo: '',
  biomaActivoData: null,
};

export default withStyles(styles)(Drawer);
