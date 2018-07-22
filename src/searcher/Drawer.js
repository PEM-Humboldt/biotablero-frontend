/* TODO: Habilitar ESTAS lineas en <Tabs /> cuando
  se tenga más de tres tipos de gráficos:
scrollable
scrollButtons="on"
*/

import axios from 'axios';
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

// var biomas = require('./data/CORPOBOYACAByBiomaArea.json');
var distritos = require('./data/CORPOBOYACAByDistritoArea.json');
var fc = require('./data/CORPOBOYACAByFCArea.json');

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
    backgroundColor: theme.palette.background.paper,
  },
});

// TODO: Realizar el llamado del JSON de datos para la gráfica
async function cargarDatosJSON(URL_JSON, bodyRequestId, idArea){
  //  @adevia
  //  this.props.idArea = Recibe el ID del área a cargar
  //  this.props.bodyRequestId

  const bodyRequest = {
          id: bodyRequestId,
          params: {
           id_car: idArea,
         },
      };
   return await axios.post(URL_JSON, bodyRequest);
}

let biomas = null;

class Drawer extends React.Component {

  componentWillMount () {
    biomas = cargarDatosJSON(
      'http://192.168.205.190:9200/_search/template?filter_path=aggregations.areas.buckets,aggregations.total_area',
      'carByBiomaArea', "CORPOBOYACA")
      // console.log('biomas: '+biomas.data);
      .then((res)=>{return res;});
      // biomas.then((biomas2) => {console.log('biomas= '+ JSON.stringify(biomas2.data.aggregations.areas.buckets.map((element) => element.key)));})
  }

  state = {
    value: 0,
  };

  checkGraph(subArea, data, labelY, graph){
    // data.then((res)=>{console.log('RES= '+ JSON.stringify(res.aggregations.areas.buckets.map((element) => element.key)))});
    if(subArea!==null && graph==='BarVertical') {
      return (
        <InfoGraph
          graphType={graph}
          name={subArea}
          data={data.then((res)=>{
            return res;
          })}
          labelY={'labelY'}
          actualizarBiomaActivo = {this.props.actualizarBiomaActivo}
        />
      );
    } else if (subArea===null && graph!=='BarVertical') {
      return (
        <InfoGraph
          graphType={graph}
          name={subArea}
          data={data.then((res)=>{
            // console.log('RES= '+ JSON.stringify(res.aggregations.areas.buckets.map((element) => element.key)));
            return res;
          })}
          labelY={labelY}
          actualizarBiomaActivo = {this.props.actualizarBiomaActivo}
        />
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
            <Tab className="tabs" label="Paisaje" icon={<Paisaje />} />
            <Tab className="tabs" label="Ecosistemas" icon={<Ecosistemas />} />
            <Tab className="tabs" label="Especies" icon={<Especies />} />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>
          {this.checkGraph(this.props.subArea,
            biomas.then((res)=>{
            return res.data;
            }),
           'biomas', 'BarStackHorizontal')}
          {/* {this.checkGraph(this.props.subArea, distritos.then((res)=>{
          return res.data;
          }), 'distritos', 'BarStackHorizontal')}
          {this.checkGraph(this.props.subArea, fc.then((res)=>{
          return res.data;
          }), 'F C', 'BarStackHorizontal')}
          {this.checkGraph(this.props.subArea, fc.then((res)=>{
          return res.data;
          }), 'F C', 'BarVertical')} */}
                     {/* // tipoG="(Bullet Charts, https://bl.ocks.org/mbostock/4061961)"
                     // datosJSON={this.props.datosJSON} */}
                 </TabContainer>}
        {value === 1 && <TabContainer>Gráfico</TabContainer>}
        {value === 2 && <TabContainer>Gráfico</TabContainer>}
      </div>
    );
  }
}

Drawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Drawer);
