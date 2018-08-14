/* TODO: Habilitar ESTAS lineas en <Tabs /> cuando
  se tenga más de tres tipos de gráficos:
scrollable
scrollButtons="on"
*/

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
import InfoGraph from './drawer/InfoGraph';
import { ParentSize } from "@vx/responsive";

import ElasticAPI from '../api/elastic';

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
  constructor(props){
    super(props);
    this.biomas = null
    this.fc = null
    this.distritos = null
    this.state = {
        value: 0,
        data_loaded: {
          biomas: false,
          distritos: false,
          fc: false
        }
      };
  }

  componentDidMount() {
    ElasticAPI.requestCarByBiomaArea('CORPOBOYACA')
      .then((res) => {
        this.biomas = res
        this.setState((prevState, props) => {
          return {
            ...prevState,
            data_loaded: {
              ...prevState.data_loaded,
              biomas: true
            }
          }
        })
      });
    ElasticAPI.requestCarByFCArea('CORPOBOYACA')
      .then((res) => {
        this.fc = res
        this.setState((prevState, props) => {
          return {
            ...prevState,
            data_loaded: {
              ...prevState.data_loaded,
              fc: true
            }
          }
        })
      });
    ElasticAPI.requestCarByDistritosArea('CORPOBOYACA')
      .then((res) => {
        this.distritos = res
        this.setState((prevState, props) => {
          return {
            ...prevState,
            data_loaded: {
              ...prevState.data_loaded,
              distritos: true
            }
          }
        })
      });
  }

  checkGraph(graphKey, data, labelX, labelY, graph, titulo) {
    // While data is being retrieved from server
    if(graphKey !== 'subarea' && !this.state.data_loaded[graphKey]) {
      return (
        <div>Loading data...</div>
      )
    }
    if(graph==='BarVertical') {
      return (
        <ParentSize className="nocolor">
          {
            (parent) => (
              parent.width
              &&
              <InfoGraph
                width={parent.width}
                height={parent.height}
                graphType={graph}
                data={data}
                labelX={labelX}
                labelY={labelY}
                titulo={titulo}
              />
            )
          }
        </ParentSize>
      );
    }
    return (
      <ParentSize className="nocolor">
        {
          (parent) => (
            parent.width
            &&
            <InfoGraph
              width={parent.width}
              height={parent.height}
              graphType={graph}
              data={data}
              labelX={labelX}
              labelY={labelY}
              titulo={titulo}
            />
          )
        }
      </ParentSize>
    );
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
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
          {value === 0 &&
            <TabContainer>
              {this.checkGraph('fc', this.fc, 'Hectáreas', 'F C', 'BarStackHorizontal', 'Factor de Compensación')}
              {this.checkGraph('biomas', this.biomas,'Hectáreas', 'Biomas', 'BarStackHorizontal', 'Biomas')}
              {this.checkGraph('distritos', this.distritos, 'Hectáreas', 'Regiones Bióticas', 'BarStackHorizontal', 'Regiones Bióticas')}
            </TabContainer>}
          {value === 1 &&
            <TabContainer>
              <div className="graphcard">
                <h2>Gráficas en construcción</h2>
                <p>Pronto más información</p>
              </div>
            </TabContainer>}
          {value === 2 &&
            <TabContainer>
              <div className="graphcard">
                <h2>Gráficas en construcción</h2>
                <p>Pronto más información</p>
              </div>
            </TabContainer>}
        </div>
      );
    }
    if(biomaActivo !== null && biomaActivoData !== null) {
      return (
        <div className={classes.root}>
          {this.checkGraph('subarea', biomaActivoData, 'Subzonas Hidrográficas', 'Hectáreas', 'BarVertical', 'HAs por Subzonas Hidrográficas')}
        </div>
      );
    }
    return (
      <div className={classes.root}>
        {/*TODO: esto probablemente nunca se ejecute, no quemar el mensae*/}
        Por favor seleccione un bioma en el mapa
      </div>
    );
  }
}

Drawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Drawer);
