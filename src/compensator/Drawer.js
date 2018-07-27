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
import QueIcon from '@material-ui/icons/LiveHelp';
import DondeIcon from '@material-ui/icons/Beenhere';
import CarritoIcon from '@material-ui/icons/AddLocation';
import Typography from '@material-ui/core/Typography';
import InfoGraph from './drawer/InfoGraph';
import { ParentSize } from "@vx/responsive";
import PopMenu from './drawer/PopMenu';

var dataJSON = require('./data/dondeCompensar.json');

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
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class Drawer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        value: 0,
        // data: null,
      };
  }

  totalACompensar = (data) => {
    let total = '5000000000'; // Dato de prueba
    return total;
  }

  mostrarGraficos(param, data, labelX, labelY, graph){
    if(param===1) {
      return (
        <ParentSize>
          {
            parent => (
              parent.width && parent.height
              &&
              <InfoGraph
              width={parent.width}
              height={parent.height}
              graphType={graph}
              data={data}
              labelX={labelX}
              labelY={labelY}
              actualizarBiomaActivo = {this.props.actualizarBiomaActivo}
              />
            )
          }
        </ParentSize>
      );
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab className="tabs tabs2" label="Qué · Cuánto" icon={<QueIcon />} />
            <Tab className="tabs tabs2" label="Dónde · Cómo" icon={<DondeIcon />} />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>
          Gráfico ¿Qué y cuánto?
                     {/* // tipoG="(Bullet Charts, https://bl.ocks.org/mbostock/4061961)"
                     // datosJSON={this.props.datosJSON} */}
                 </TabContainer>}
        {value === 1 && <TabContainer>
          {this.mostrarGraficos(1, dataJSON, 'Area afectada', 'Factor de Compensación', 'ScatterChart')}
          <p>
            Total a compensar: {this.totalACompensar(dataJSON)}
          </p>
          <CarritoIcon />
        </TabContainer>}
      </div>
    );
  }
}

Drawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Drawer);
