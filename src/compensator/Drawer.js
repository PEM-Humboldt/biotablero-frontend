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
import Typography from '@material-ui/core/Typography';
import InfoGraph from './drawer/InfoGraph';
import { ParentSize } from "@vx/responsive";
import PopMenu from './drawer/PopMenu';
import How from './How';
import BackIcon from '@material-ui/icons/FirstPage';

// var dataCompensaciones = require('./data/dondeCompensar.json');
var dataCompensaciones = require('./data/que_y_donde_compensar.json');
var dataSogamoso = require('./data/donde_compensar_sogamoso.json');

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
      datosDonde: [],
      totalACompensar: '5000000000', // TODO: Dato de prueba, agregar desde el JSON
      jurisdiccion: null,
      szh: null,
      biomaColor: "white",
      mostrarDatosEnGrafico: null,
      areaSeleccionada: null,
    };
  }

  biomaColor(biomaColor) {
    console.log("biomaColor: "+biomaColor);
    this.setState({
      color: biomaColor,
    });
  }

  obtenerDatosDonde = (data) => {
    const transformedData = [];
    data.hits.hits.forEach(item => {
      transformedData.push(
        {
          name:`${item.fields.BIOMA_IAVH}`,
          percentageAffect: `${item.fields.PORCENT_AFECTACION}`,
          fc: `${item.fields.FACT_COMP}`,
          natural_afectada: `${item.fields.NATURAL_AFECTADA}`,
          total_afectada: `${item.fields.TOTAL_AFECTADA}`,
        }
      );
    });
    this.setState ({
      datosDonde: transformedData,
      totalACompensar: data.aggregations.total_area.value,
    });
    return transformedData;
  };

  ocultarDatosGrafico = () => {
    // console.log('bioma, szh, jurisdiccion: '+ this.props.subArea, szh, jurisdiccion);
    this.setState ({
      mostrarDatosEnGrafico: false, // Ocultar el gráfico
    });
  }

  cargarEstrategia = (estado, szh, jurisdiccion) => {
    // console.log('bioma, szh, jurisdiccion: '+ this.props.subArea, szh, jurisdiccion);
    this.ocultarDatosGrafico();
  }

  obtenerDatosQue = (data) => {
    // TODO: Realizar esta función
  };

  actualizarTotalACompensar = (data) => {
    // TODO: Actualizar desde el PopMenu
  }

  obtenerSubzonas = (data) => {
    // TODO: Obtener de dataSogamoso el arreglo correspondiente al biomaActivo
    // const transformedData = [];
    // data.aggregations.car.buckets[0].forEach(item => {
    //   transformedData.push(
    //     {
    //       name:`${item.fields.BIOMA_IAVH}`,
    //       percentageAffect: `${item.fields.PORCENT_AFECTACION}`,
    //       fc: `${item.fields.FACT_COMP}`,
    //       natural_afectada: `${item.fields.NATURAL_AFECTADA}`,
    //       total_afectada: `${item.fields.TOTAL_AFECTADA}`,
    //     }
    //   );
    // });
    // this.setState ({
    //   datosDonde: transformedData,
    //   totalACompensar: data.aggregations.total_area.value,
    // });
    // return transformedData;
  }

  componentDidUpdate () {
    if (this.state.mostrarDatosEnGrafico) {
      // actualizarTotalACompensar(dataJSON, );
}
}

  componentWillMount () {
    this.obtenerDatosQue(dataSogamoso);
    this.obtenerDatosDonde(dataCompensaciones);
  }

  mostrarGraficos(param, data, labelX, labelY, graph, colors){
    if(param===1 && graph==="Dots") {
      return (
        <ParentSize className="nocolor">
          {
            parent => (
              parent.width && parent.height
              &&
              <InfoGraph
                width={parent.width}
                height={parent.height}
                colors= {colors}
                graphType={graph}
                data={data}
                labelX={labelX}
                labelY={labelY}
                actualizarBiomaActivo = {this.props.actualizarBiomaActivo}
                biomaActivo={this.props.biomaActivo}
                biomaColor = {this.biomaColor}
              />
            )
          }
        </ParentSize>
      );
    }
  }

  showSelector = (data, total, color) => {
    // TODO: Finalizar muestra de selector de szh y CAR
    if(total!==0) {
      return (
        <ParentSize className="nocolor">
          {
            parent => (
              parent.width && parent.height
              &&
              <PopMenu
                actualizarBiomaActivo={this.props.actualizarBiomaActivo}
                subArea= {this.props.subArea}
                szh= {this.props.actualizarBiomaActivo}
                color = {this.state.color}
                cargarEstrategia = {this.cargarEstrategia}
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
            <div className="total">
              <h3>Total a compensar</h3>
              <h4>{Number(this.state.totalACompensar).toFixed(2)}</h4>
            </div>
            <table className="graphcard">
              <tbody>
                <tr className="row1table">
                  <th>BIOMA IAVH</th>
                  <th>F.C.</th>
                  <th>NAT.</th>
                  <th>SEC.</th>
                  <th>TRANS.</th>
                  <th>AFECT.</th>
                  <th>TOTAL</th>
                </tr>
                <tr className="row2table">
                  <td>Helobioma Altoandino cordillera oriental</td>
                  <td>7</td>
                  <td></td>
                  <td></td>
                  <td>2.19</td>
                  <td>0.3%</td>
                  <td>2.19</td>
                </tr>
                <tr className="row2table">
                  <td>Helobioma Magdalena medio y depresión momposina</td>
                  <td>7.75</td>
                  <td>1.15</td>
                  <td>0.14</td>
                  <td>3.34</td>
                  <td>0.7%</td>
                  <td>12.83</td>
                </tr>
                <tr className="row2table">
                  <td>Hidrobioma Altoandino cordillera oriental</td>
                  <td>5.25</td>
                  <td></td>
                  <td>0.58</td>
                  <td>0.02</td>
                  <td>0.1%</td>
                  <td>3.07</td>
                </tr>
                <tr className="row2table">
                  <td>Hidrobioma Cordillera oriental Magdalena medio</td>
                  <td>4.25</td>
                  <td></td>
                  <td>1.86</td>
                  <td>2.78</td>
                  <td>0.7%</td>
                  <td>10.71</td>
                </tr>
                <tr className="row2table">
                  <td>Hidrobioma Cordillera oriental Magdalena medio</td>
                  <td>4.25</td>
                  <td></td>
                  <td>1.86</td>
                  <td>2.78</td>
                  <td>0.7%</td>
                  <td>10.71</td>
                </tr>
                <tr className="row2table">
                  <td>Hidrobioma Guane-Yariguíes</td>
                  <td>4.25</td>
                  <td></td>
                  <td></td>
                  <td>0.14</td>
                  <td>0.0%</td>
                  <td>0.14</td>
                </tr>
                <tr className="row2table">
                  <td>Hidrobioma Magdalena medio y depresión momposina</td>
                  <td>5.25</td>
                  <td></td>
                  <td>15.24</td>
                  <td>12.46</td>
                  <td>4.3%</td>
                  <td>92.47</td>
                </tr>
                <tr className="row2table">
                  <td>Hidrobioma Nechí-San Lucas</td>
                  <td>5.5</td>
                  <td>1.09</td>
                  <td></td>
                  <td>2.28</td>
                  <td>0.5%</td>
                  <td>8.32</td>
                </tr>
                <tr className="row2table">
                  <td>Orobioma Andino Altoandino cordillera oriental</td>
                  <td>7.75</td>
                  <td>38.62</td>
                  <td>1.63</td>
                  <td>114.60</td>
                  <td>23.8%</td>
                  <td>420.31</td>
                </tr>
                <tr className="row2table">
                  <td>Orobioma Andino Cordillera oriental Magdalena medio</td>
                  <td>8</td>
                  <td>6.40</td>
                  <td></td>
                  <td>26.22</td>
                  <td>5.0%</td>
                  <td>77.44</td>
                </tr>
                <tr className="row2table">
                  <td>Orobioma Andino Guane-Yariguíes</td>
                  <td>6.75</td>
                  <td>1.99</td>
                  <td>0.69</td>
                  <td>84.21</td>
                  <td>13.4%</td>
                  <td>100.03</td>
                </tr>
                <tr className="row2table">
                  <td>Orobioma Andino Tolima grande</td>
                  <td>7.25</td>
                  <td></td>
                  <td></td>
                  <td>1.22</td>
                  <td>0.2%</td>
                  <td>1.22</td>
                </tr>
                <tr className="row2table">
                  <td>Orobioma Azonal Andino Altoandino cordillera oriental</td>
                  <td>8.25</td>
                  <td>14.77</td>
                  <td></td>
                  <td>32.35</td>
                  <td>7.3%</td>
                  <td>154.27</td>
                </tr>
                <tr className="row2table">
                  <td>Orobioma Azonal Andino Cordillera oriental Magdalena medio</td>
                  <td>8</td>
                  <td></td>
                  <td></td>
                  <td>0.10</td>
                  <td>0.0%</td>
                  <td>0.10</td>
                </tr>
                <tr className="row2table">
                  <td>Orobioma Azonal Andino Tolima grande</td>
                  <td>8.25</td>
                  <td>2.63</td>
                  <td>2.91</td>
                  <td>6.17</td>
                  <td>1.8%</td>
                  <td>39.91</td>
                </tr>
                <tr className="row2table">
                  <td>Orobioma Azonal Subandino Cordillera oriental Magdalena medio</td>
                  <td>7.5</td>
                  <td></td>
                  <td>0.07</td>
                  <td>1.40</td>
                  <td>0.2%</td>
                  <td>1.70</td>
                </tr>
                <tr className="row2table">
                  <td>Orobioma Azonal Subandino Tolima grande</td>
                  <td>9</td>
                  <td></td>
                  <td>0.75</td>
                  <td>2.37</td>
                  <td>0.5%</td>
                  <td>5.75</td>
                </tr>
                <tr className="row2table">
                  <td>Orobioma de Paramo Altoandino cordillera oriental</td>
                  <td>6.25</td>
                  <td>9.70</td>
                  <td></td>
                  <td>3.60</td>
                  <td>2.0%</td>
                  <td>64.24</td>
                </tr>
                <tr className="row2table">
                  <td>Orobioma Subandino Altoandino cordillera oriental</td>
                  <td>8.5</td>
                  <td></td>
                  <td></td>
                  <td>2.93</td>
                  <td>0.5%</td>
                  <td>2.93</td>
                </tr>
                <tr className="row2table">
                  <td>Orobioma Subandino Cordillera oriental Magdalena medio</td>
                  <td>7.75</td>
                  <td>1.74</td>
                  <td></td>
                  <td>5.92</td>
                  <td>1.2%</td>
                  <td>19.40</td>
                </tr>
                <tr className="row2table">
                  <td>Orobioma Subandino Guane-Yariguíes</td>
                  <td>7.5</td>
                  <td>1.40</td>
                  <td>3.46</td>
                  <td>27.98</td>
                  <td>5.1%</td>
                  <td>51.50</td>
                </tr>
                <tr className="row2table">
                  <td>Zonobioma Humedo Tropical Cordillera oriental Magdalena medio</td>
                  <td>7.25</td>
                  <td>5.58</td>
                  <td>0.81</td>
                  <td>20.48</td>
                  <td>4.1%</td>
                  <td>63.93</td>
                </tr>
                <tr className="row2table">
                  <td>Zonobioma Humedo Tropical Guane-Yariguíes</td>
                  <td>7</td>
                  <td></td>
                  <td></td>
                  <td>3.52</td>
                  <td>0.5%</td>
                  <td>3.52</td>
                </tr>
                <tr className="row2table">
                  <td>Zonobioma Humedo Tropical Magdalena medio y depresión momposina</td>
                  <td>7.75</td>
                  <td>11.10</td>
                  <td>24.21</td>
                  <td>64.97</td>
                  <td>15.4%</td>
                  <td>244.86</td>
                </tr>
                <tr className="row2table">
                  <td>Zonobioma Humedo Tropical Nechí-San Lucas</td>
                  <td>7</td>
                  <td>21.40</td>
                  <td>3.11</td>
                  <td>55.19</td>
                  <td>12.3%</td>
                  <td>215.90</td>
                </tr>
                <tr className="row3table">
                  <td>TOTALES (CUANTO)</td>
                  <td></td>
                  <td>135.31</td>
                  <td>37.82</td>
                  <td>476.56</td>
                  <td>100.0%</td>
                  <td>1596.87</td>
                </tr>
              </tbody>
            </table>
            {/* // tipoG="(Bullet Charts, https://bl.ocks.org/mbostock/4061961)"
            // datosJSON={this.props.datosJSON} */}
          </TabContainer>}
          {value === 1 && <TabContainer>
            <div className="total">
              <h3>Total a compensar</h3>
              <h4>{Number(this.state.totalACompensar).toFixed(2)}</h4>
            </div>
            <div className="total carrito">
              <h3>Áreas seleccionadas</h3>
              <h4>0</h4>
            </div>
            {/* {this.mostrarGraficos(1, this.state.datosDonde, '% Area afectada', 'Factor de Compensación', 'Dots', ['#51b4c1','#eabc47','#ea495f'])} */}
            {/* {this.showSelector(this.state.datosDonde, this.state.totalACompensar)} */}
            <br></br>
            <button className="geobtn"
              onClick={() => this.props.verMenu("Selector")}>
              <BackIcon /> Regresar al gráfico "Dónde compensar"
            </button><br></br>
              <strong>Bioma:</strong> Orobioma Andino Altoandino cordillera oriental <br></br>
              <strong>SZH:</strong> Río Suárez <br></br>
              <strong>Jurisdicción:</strong> Corporacion Autonoma Regional de Cundinamarca
            <How />
          </TabContainer>}
        </div>
      );
    }
  }

  Drawer.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(Drawer);
