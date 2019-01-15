import React from 'react';
import PropTypes from 'prop-types';
import Layout from './Layout';

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
            <div id="options-wrap">
              <div id="options">
                <h1>Filtros temáticos de indicadores</h1>
                <div className="metas" id="metas">
                  <div className="filter option-set" data-filter-group="metas">
                    <h5>Metas</h5>
                    <a className="metas aichi5" id="aichi5" data-filter-value=".aichi5" data-tooltip title="Meta Aichi 5 · Pérdida, degradación y fragmentación - Para 2020 se habrá reducido por lo menos a la mitad y, donde resulte factible, se habrá reducido hasta un valor cercano a cero el ritmo de pérdida de todos los hábitats naturales, incluidos los bosques, y se habrá reducido de manera significativa la degradación y fragmentación."><label className="metas" for="aichi5">Aichi 5</label></a>
                    <a className="metas aichi11" id="aichi11" data-filter-value=".aichi11" data-tooltip title="Meta Aichi 11 · Áreas protegidas - Para 2020, al menos el 17 por ciento de las zonas terrestres y de aguas continentales y el 10 por ciento de las zonas marinas y costeras, especialmente aquellas de particular importancia para la diversidad biológica y los servicios de los ecosistemas, se conservan por medio de sistemas de áreas protegidas administrados de manera eficaz y equitativa, ecológicamente representativos y bien conectados y otras medidas de conservación eficaces basadas en áreas, y están integradas en los paisajes terrestres y marinos más amplios."><label className="metas" for="aichi11">Aichi 11</label></a>
                    <a className="metas aichi12" id="aichi12" data-filter-value=".aichi12" data-tooltip title="Meta Aichi 12 · Especies amenazadas - Para 2020, se habrá evitado la extinción de especies en peligro identificadas y su estado de conservación se habrá mejorado y sostenido, especialmente para las especies en mayor declive."><label className="metas" for="aichi12">Aichi 12</label></a>
                    <a className="metas aichi14" id="aichi14" data-filter-value=".aichi14" data-tooltip title="Meta Aichi 14 · Ecosistemas estratégicos - Para 2020, se han restaurado y salvaguardado los ecosistemas que proporcionan servicios esenciales, incluidos servicios relacionados con el agua, y que contribuyen a la salud, los medios de vida y el bienestar, tomando en cuenta las necesidades de las mujeres, las comunidades indígenas y locales y los pobres y vulnerables."><label className="metas" for="aichi14">Aichi 14</label></a>
                    <a className="metas aichi19" id="aichi19" data-filter-value=".aichi19" data-tooltip title="Meta Aichi 19 · Conocimiento - Para 2020, se habrá avanzado en los conocimientos, la base científica y las tecnologías referidas a la diversidad biológica, sus valores y funcionamiento, su estado y tendencias y las consecuencias de su pérdida, y tales conocimientos y tecnologías serán ampliamente compartidos, transferidos y aplicados."><label className="metas" for="aichi19">Aichi 19</label></a>
                    <a className="metas ods15_1" id="ods2_5" data-filter-value=".ods2_5" data-tooltip title="Meta ODS 2.5 · Diversidad genética parientes silvestres - Para 2020 mantener la diversidad genética de las semillas, plantas cultivadas, animales de granja y domesticados y de las especies silvestres relacionadas, a través de la correcta gestión de bancos diversificados de semillas y plantas a nivel nacional, regional e internacional, y asegurar el acceso y la distribución justa y equitativa de los beneficios derivados de la utilización de los recursos genéticos y los conocimientos tradicionales asociados según lo acordado internacionalmente."><label className="metas" for="ods2_5">ODS 2.5</label></a>
                    <a className="metas ods15_1" id="ods15_1" data-filter-value=".ods15_1" data-tooltip title="Meta ODS 15.1 · Ecosistemas estratégicos - En 2020 asegurar la conservación, restauración y uso sostenible de los ecosistemas de agua dulce terrestres e interiores y de sus servicios, en particular los bosques, los humedales, las montañas y las tierras secas, en conformidad con las obligaciones en virtud de los acuerdos internacionales."><label className="metas" for="ods15_1">ODS 15.1</label></a>
                    <a className="metas ods15_1" id="ods15_5" data-filter-value=".ods15_5" data-tooltip title="Meta ODS 15.5 · Degradación, pérdida y especies amenazadas - Tomar medidas urgentes y significativas para reducir la degradación del hábitat natural, detener la pérdida de biodiversidad, y en 2020 de proteger y evitar la extinción de especies amenazadas."><label className="metas" for="ods15_5">ODS 15.5</label></a>
                    <a className="metas ods15_1" id="ods15_4" data-filter-value=".ods15_4" data-tooltip title="Meta ODS 15.4 · Ecosistemas de montaña - En 2030 asegurar la preservación de los ecosistemas de montaña, incluyendo su biodiversidad, para mejorar su capacidad para proporcionar beneficios que son esenciales para el desarrollo sostenible."><label className="metas" for="ods15_4">ODS 15.4</label></a>
                    <a className="metas ods15_1" id="minimo" data-filter-value=".minimo" data-tooltip title="Estos son los indicadores seleccionados por la mesa de Biodiversidad, liderada por el MADS y con participación de los Institutos de Investigación del SINA y el ANLA durante el 2016, como aquellos indicadores mínimos que deben ser generados periódicamente por el sector ambiental."><label className="metas" for="minimo">Mínimo de Biodiversidad</label></a>
                    <a className="metas ods15_1" id="pen" data-filter-value=".pen" data-tooltip title="Estos indicadores corresponden a operaciones estadísticas propuesta en actual Plan Estadístico Nacional 2017-20122 coordinado por el DANE y que constituye el principal instrumento de política que busca garantizar que el país cuente con una oferta estadística suficiente y robusta para entender su realidad económica, sociodemográfica y ambiental."><label className="metas" for="pen">Plan Estadístico Nacional</label></a>
                  </div>
                </div>
                <div className="perb" id="perb">
                  <div className="filter option-set" data-filter-group="perb">
                    <h5>PERB</h5>
                    <a className="perb presion" id="presion" data-filter-value=".presion"><label className="perb" for="presion">Presión</label></a>
                    <a className="perb estado" id="estado" data-filter-value=".estado"><label className="perb" for="estado">Estado</label></a>
                    <a className="perb respuesta" id="respuesta" data-filter-value=".respuesta"><label className="perb" for="respuesta">Respuesta</label></a>
                    <a className="perb beneficio" id="beneficio" data-filter-value=".beneficio"><label className="perb" for="beneficio">Beneficio</label></a>
                  </div>
                </div>
                <div className="ecospp" id="ecospp">
                  <div className="filter option-set" data-filter-group="ecospp">
                  <h5>Ecosistemas y especies</h5>
                    <a className="ecospp ecospp-cobertura" id="ecospp-cobertura" data-filter-value=".ecospp-cobertura"><label className="ecospp" for="ecospp-cobertura">Ecosistemas Cobertura</label></a>
                    <a className="ecospp ecospp-areasp" id="ecospp-areasp" data-filter-value=".ecospp-areasp"><label className="ecospp" for="ecospp-areasp">Ecosistemas Áreas Protegídas</label></a>
                    <a className="ecospp ecospp-humedales" id="ecospp-humedales" data-filter-value=".ecospp-humedales"><label className="ecospp" for="ecospp-humedales">Ecosistemas humedales</label></a>
                    <a className="ecospp ecospp-especies" id="ecospp-especies" data-filter-value=".ecospp-especies"><label className="ecospp" for="ecospp-especies">Especies</label></a>
                    <a className="ecospp ecospp-amenazadas" id="ecospp-amenazadas" data-filter-value=".ecospp-amenazadas"><label className="ecospp" for="ecospp-amenazadas">Especies amenazadas</label></a>
                    <a className="ecospp ecospp-invasoras" id="ecospp-invasoras" data-filter-value=".ecospp-invasoras"><label className="ecospp" for="ecospp-invasoras">Especies invasoras</label></a>
                  </div>
                </div>
              </div>
            </div>

            <div className="container filter-display-container">
              <p id="filter-display">
                <span className="filter-label data-counter pull-right" />
              </p>
              <p id="filter-counter" />
            </div>

            <div id="filter-container" className="isotope">
              <div id="art">
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
