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
import { ParentSize } from "@vx/responsive";

var biomas = require('./data/CORPOBOYACAByBiomaArea.json');
var distritos = require('./data/CORPOBOYACAByDistritoArea.json');
var fc = require('./data/CORPOBOYACAByFCArea.json');
var uwa = require('./data/CORPOBOYACABySZH_Orobioma de Paramo Uwa.json');

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

// let biomas = null;

class Drawer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        value: 0,
        // data: null,
      };
      this.cargarDatosJSON = this.cargarDatosJSON.bind(this);
  }

  // TODO: Realizar el llamado del JSON de datos para la gráfica
  cargarDatosJSON(URL_JSON, bodyRequestId, idArea){
    //  @adevia
    //  this.props.idArea = Recibe el ID del área a cargar
    //  this.props.bodyRequestId

    const bodyRequest = {
            id: bodyRequestId,
            params: {
             id_car: idArea,
           },
        };

        let respuesta = null;
        axios.post(URL_JSON, bodyRequest)
        .then( res => {
          // console.log('cargarDatosJSON: '+JSON.stringify(res));
          this.setState({data: res});
          respuesta = res;
        }
        );

        return respuesta;
     // return axios.post(URL_JSON, bodyRequest);
  }

  componentWillMount () {
    this.cargarDatosJSON(
      'http://192.168.11.63:9200/_search/template?filter_path=aggregations.areas.buckets,aggregations.total_area',
      'carByBiomaArea', "CORPOBOYACA");
      // console.log(this.state.data);
      // .then((res)=>{
      //   console.log('Res_CWM: '+JSON.stringify(res));
      //   this.setState(
      //     (state)=>({
      //       data: res,})
      //   );
      //   console.log(this.state.data);
      // }
      // );
            setInterval(this.inc, 1000);

      // biomas.then((biomas2) => {console.log('biomas= '+ JSON.stringify(biomas2.data.aggregations.areas.buckets.map((element) => element.key)));})
  }

  componentDidUpdate() {
    // console.log('State: '+ JSON.stringify(this.state.data));
  }


  checkGraph(data, labelX, labelY, graph, titulo) {
    // data.then((res)=>{console.log('RES= '+ JSON.stringify(res.aggregations.areas.buckets.map((element) => element.key)))});
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
                actualizarBiomaActivo = {this.props.actualizarBiomaActivo}
              />
            )
          }
        </ParentSize>
      );
    } else {
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

    if (this.props.subArea === null){
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
          {this.checkGraph(fc, 'Hectáreas', 'F C', 'BarStackHorizontal', 'Factor de Compensación')}
          {this.checkGraph(biomas,'Hectáreas', 'Biomas', 'BarStackHorizontal', 'Biomas')}
          {this.checkGraph(distritos, 'Hectáreas', 'Regiones Bióticas', 'BarStackHorizontal', 'Regiones Bióticas')}
                     {/* // tipoG="(Bullet Charts, https://bl.ocks.org/mbostock/4061961)"
                     // datosJSON={this.props.datosJSON} */}
                 </TabContainer>}
          {value === 1 && <TabContainer>
                            <div className="graphcard">
                              <h2>Gráficas en construcción</h2>
                              <p>Pronto más información</p>
                            </div>
                          </TabContainer>}
          {value === 2 && <TabContainer>
                            <div className="graphcard">
                              <h2>Gráficas en construcción</h2>
                              <p>Pronto más información</p>
                            </div>
                          </TabContainer>}
          </div>
        );
      } else {
        return (
        <div className={classes.root}>
          {this.checkGraph(uwa, 'Subzonas Hidrográficas', 'Hectáreas', 'BarVertical', 'HAs por Subzonas Hidrográficas')}
        </div>
      );
    }
  }
}

Drawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Drawer);
