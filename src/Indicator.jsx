import React from 'react';
import PropTypes from 'prop-types';
import Layout from './Layout';
import CardManager from './indicator/CardManager';

import { thumbnailsData } from './indicator/assets/selectorData';

class Indicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
    };
  }

  handleCloseModal = () => {
    const { openModal } = this.state;
    this.setState({ openModal: !openModal });
  };

  render() {
    const { callbackUser, userLogged } = this.props;
    return (
      <Layout
        moduleName="Indicadores"
        showFooterLogos
        userLogged={userLogged}
        callbackUser={callbackUser}
      >
        <div className="filters">
          <div id="filters">
            <div className="options">
              <h1>Filtros temáticos de indicadores</h1>
            </div>

            <div className="container filter-display-container">
              <p id="filter-display">
                <span className="filter-label data-counter pull-right" />
              </p>
              <p id="filter-counter" />
            </div>

            <div id="filter-container" className="isotope">
              <div id="art">
                <CardManager thumbnailsData={thumbnailsData} />
                <div className="item aichi5 estado ecospp-cobertura">
                  <h1>Porcentaje de cobertura boscosa</h1>
                  <h2>
                    Forest area as a percentage of total land area
                    (proposed indictor for SDG target 15.1)
                  </h2>
                  <h3>1990 - 2014</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi5 estado ecospp-cobertura">
                  <h1>Porcentaje de cobertura natural</h1>
                  <h2>Natural habitat extent (land area minus urban and agriculture)</h2>
                  <h3>2005 - 2012</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi11 respuesta ecospp-areasp">
                  <h1>Porcentaje de área cubierta por áreas protegidas</h1>
                  <h2>% terrestrial and inland water areas covered by protected areas</h2>
                  <h3>1938 - 2015</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi11 ods15_1 respuesta ecospp-areasp">
                  <h1>Proporción de ecosistemas importantes para la diversidad biológica</h1>
                  <h2>Representados en áreas protegidas</h2>
                  <h3>1938 - 2015</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi12 ods15_5 estado ecospp-amenazadas">
                  <h1>Índice de Lista Roja</h1>
                  <h2>Red List Index (proposed indictor for SDG target 15.5)</h2>
                  <h3>1982 - 2015</h3>
                  <a href="./redlist.html" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi12 estado ecospp-especies">
                  <h1>Porcentaje de la distribución de especies sensibles</h1>
                  <h2>Con cobertura natural</h2>
                  <h3>2005 - 2015</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi12 respuesta ecospp-especies ecospp-areasp">
                  <h1>Porcentaje de la distribución de especies sensibles</h1>
                  <h2>Cubierta por áreas protegidas</h2>
                  <h3>1938 - 2015</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi14 estado ecospp-humedales">
                  <h1>Extensión de humedales</h1>
                  <h2>Wetland extent (proposed indictor for SDG target 6.6)</h2>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi14 ods15_4 respuesta ecospp-areasp">
                  <h1>Proporción de ecosistemas de montaña</h1>
                  <h2>En áreas protegidas</h2>
                  <h3>1938 - 2015</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi14 ods2_5 estado ecospp-especies">
                  <h1>Proporción de especies locales (de uso alimenticio)</h1>
                  <h2>
                    Clasificadas según su situación de riesgo, ausencia de riesgo o nivel de riesgo
                    de extinción desconocido
                  </h2>
                  <h3>1982 - 2015</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi19 minimo pen estado ecospp-especies">
                  <h1>Número de especies observadas por grupo taxonómico</h1>
                  <h2>
                    A nivel nacional, por unidad político/administrativa o por región natural
                    o área de interés o Proporción de especies por grupo taxonómico con registros
                    disponibles a través del SIB
                  </h2>
                  <h3>1976 - 2016</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi19 minimo estado ecospp-especies">
                  <h1>Variación de la superficie</h1>
                  <h2>Con información de registros biológicos disponible en el SIB</h2>
                  <h3>1960 - 2016</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi19 pen estado ecospp-amenazadas">
                  <h1>Número de especies por categoría de lista roja</h1>
                  <h2>
                    No evaluado, Datos Insuficientes, Extinto, Extinto en Estado Silvestre,
                    En Peligro Crítico, En Peligro, Vulnerable, Casi Amenazado y Preocupación Menor.
                    Número de especies en cada categoría a nivel nacional
                  </h2>
                  <h3>1965 - 2015</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi19 minimo estado ecospp-especies">
                  <h1>
                    Proporción de especies con evaluación de riesgo en relación con las
                    especies conocidas
                  </h1>
                  <h2>Proportion of known species assessed through the IUCN Red List</h2>
                  <h3>1965 - 2015</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item pen estado ecospp-especies">
                  <h1>Número de especies potenciales por grupo taxonómico</h1>
                  <h2>
                    A nivel nacional, por unidad político/administrativa o por región
                    natural o área de interés
                  </h2>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item pen presion ecospp-cobertura ecospp-invasoras">
                  <h1>Índice de riesgo de invasión</h1>
                  <h2>Para cada pixel del área geográfica</h2>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item pen presion ecospp-cobertura ecospp-invasoras">
                  <h1>
                    Número de especies potenciales a estar presente o potenciales a desaparecer
                  </h1>
                  <h2>
                    En escenarios de cambio climático por grupo taxonómico a nivel nacional,
                    por unidad político/administrativa o por región natural o área de interés
                  </h2>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item beneficio ecospp-especies">
                  <h1>Riqueza de especies asociadas a la pesca</h1>
                  <h2>Por zonas hidrográficas</h2>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item estado ecospp-amenazadas">
                  <h1>Proporción de especies amenazadas</h1>
                  <h2>Con respecto al total de especies asociadas a la pesca</h2>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi5 ods15_1 minimo ecospp-cobertura">
                  <h1>Tasa anual de deforestación</h1>
                  <h3>1990 - 2014</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
                <div className="item aichi5 ods15_1 estado ecospp-cobertura">
                  <h1>Degradación de bosques</h1>
                  <h2>En la Amazonía</h2>
                  <h3>2002 - 2012</h3>
                  <a href="./Indicadores" data-tooltip title="Ir al indicador">+</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

Indicator.propTypes = {
  callbackUser: PropTypes.func.isRequired,
  userLogged: PropTypes.object,
};

Indicator.defaultProps = {
  userLogged: null,
};

export default Indicator;
