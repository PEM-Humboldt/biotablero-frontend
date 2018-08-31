import React from 'react';
var $ = require ('jquery');

function showDiv(currentElement) {
  $(".content").css("display", "none");
  $(".cont1").css("display", "block");
  $('menu button').removeClass('active');
  $(".btn1").addClass('active');
}

function showDiv2(currentElement) {
  $(".content").css("display", "none");
  $(".cont2").css("display", "block");
  $('menu button').removeClass('active');
  $(".btn2").addClass('active');
}

function showDiv3(currentElement) {
  $(".content").css("display", "none");
  $(".cont3").css("display", "block");
  $('menu button').removeClass('active');
  $(".btn3").addClass('active');
}

function showDiv4(currentElement) {
  $(".content").css("display", "none");
  $(".cont4").css("display", "block");
  $('menu button').removeClass('active');
  $(".btn4").addClass('active');
}

class Information extends React.Component {
  constructor(props){
    super(props);
    this.state = ({
      descriptionActive: null,
    });
  }

  render () {
    return(

    <div className="menuline">
        {/* <menu id="listado">
        <Element styles={"btnhome active"} valueB="01" value=" ¿Qué es?"/>
        <Element styles={"btnhome"} valueB="02" value=" ¿Por qué?"/>
        <Element styles={"btnhome"} valueB="03" value=" ¿Quién produce?"/>
        <Element styles={"btnhome"} valueB="04" value=" ¿Qué encuentras?"/>
      </menu>
      <Description /> */}
      <menu>
        <button className="btnhome btn1 active" onClick={(event) => showDiv(this)}><b>01</b> ¿Qué es?</button>
        <button className="btnhome btn2" onClick={(event) => showDiv2(this)}><b>02</b> ¿Por qué?</button>
        <button className="btnhome btn3" onClick={(event) => showDiv3(this)}><b>03</b> ¿Quién produce?</button>
        <button className="btnhome btn4" onClick={(event) => showDiv4(this)}><b>04</b> ¿Qué encuentras?</button>
      </menu>
      <div className="geocont invisible">
        <div className="content cont1">
          <h1>¿Qué son las consultas geográficas?</h1>
          <p>Las consultas geográficas permiten <b>visualizar información existente para unos límites geográficos predeterminados</b>. Técnicamente es una sobreposición de información geográfica, en donde dada una entrada definida por el usuario, por ejemplo un departamento, una cuenta hidrográfica, una jurisdicción ambiental, se busca la información disponible en el Instituto Humboldt y se presenta una síntesis para las siguientes temáticas: <b>ecología del paisaje, especies y ecosistemas</b>.</p>
        </div>
        <div className="content cont2">
          <h1>¿Por qué este módulo?</h1>
          <p>En Colombia se ha avanzado en la generación de información geográfica sobre temáticas ambientales, económicas y sociales, y en el desarrollo de mecanismos y plataformas para compartirla. El acceso abierto a datos geográficos es una tendencia global. Quien busca información geográfica sobre biodiversidad y ecosistemas puede encontrarla en varias fuentes, en portales nacionales como el SIB Colombia, el SIAC, y en los diferentes portales de datos de los institutos de Investigación o en portales globales como Biodiversity Dashboard o Global Forest Watch, entre otros. El módulo de consultas geográficas en el BioTablero es necesario porque <b>permite al usuario tener una lectura rápida de la información más relevante</b> para su área de interés bajo tres temáticas de biodiversidad: paisajes, especies y ecosistemas, simplificando la búsqueda y selección de información pertinente.</p>
        </div>
        <div className="content cont3">
          <h1>¿Quién selecciona las consultas geográficas?</h1>
          <p>La información que se dispone en BioTablero es generada por múltiples fuentes nacionales e internacionales que disponen sus datos de manera abierta. Sin embargo no toda la información existente está disponible en el BioTablero. Investigadores del Instituto Humboldt seleccionan la <b>información de mayor pertinencia para el entendimiento general del estado de la biodiversidad</b> y en conjunto con el grupo de trabajo de BioTablero se procesa para entregar al usuario una visualización gráfica que representa las cifras y patrones más relevantes en su área de interés.</p>
        </div>
        <div className="content cont4">
          <h1>¿Qué encuentras en esta sitio? </h1>
          <p>En las consultas geográficas encuentras <b>mapas, cifras y gráficas</b> que dan cuanta del estado de la biodiversidad en un área geográfica particular bajo tres temáticas:<br></br><b>1) Paisajes:</b> Acá encuentras información relacionada con ecosistemas equivalentes y factores de compensación, métricas de fragmentación y conectividad. <br></br><b>2) Especies:</b> Acá encuentras cifras sobre número de especies y registros, especies amenazadas, vacíos de información, cambio de hábitat en especies asociadas al bosque, diversidad alfa y beta, representatividad de especies en áreas protegidas. <br></br><b>3) Ecosistema:</b> Cambio de cobertura en ecosistemas estratégicos, representatividad de ecosistemas en áreas protegidas.</p>
        </div>
      </div>

      <div className="indicont invisible">
        <div className="content cont1">
          <h1>¿Qué son los indicadores de biodiversidad?</h1>
          <p>Los indicadores de biodiversidad son <b>medidas</b> que nos hablan sobre <b>aspectos particulares de la biodiversidad,</b> algunos la cuantifican, otros se refieren a su condición, otros dimensionan las presiones que la afectan. Una característica importante de los indicadores es <b>que se encuentren relacionados con un contexto particular</b> en el que puedan ser utilizados para apoyar la toma de decisiones ambientales. Por ejemplo, la cifra sobre riqueza de especies (número de especies presentes en un lugar y tiempo determinado) no es un indicador si no se encuentra asociado con una <b>“historia” y un objetivo particular,</b> es así como la riqueza de especies se convierte en un indicador cuando nuestro objetivo es, por ejemplo, representar en las Áreas Protegidas al menos el 80% de las especies conocidas presentes en Colombia y utilizamos la riqueza como una medida que se repite a través del tiempo para cuantificar el avance hacia el objetivo planteado.</p>
        </div>
        <div className="content cont2">
          <h1>¿Por qué son importantes los indicadores?</h1>
          <p>Los indicadores son una herramienta que <b>provee información robusta</b> sobre el estado actual de la biodiversidad y sus tendencias. Al ser información medible, cuantificable y periódica los indicadores <b>permiten evaluar cómo está nuestra biodiversidad y cómo se ve o verá afectada</b> bajo diferentes escenarios de manejo o gestión. Los indicadores proveen evidencia científica y contextualizada para entender los cambios en la biodiversidad y sus posibles consecuencias para el bienestar humano, <b>convirtiéndose en herramientas poderosas para tomar decisiones ambientales informadas.</b></p>
        </div>
        <div className="content cont3">
          <h1>¿Quién produce los indicadores de biodiversidad?</h1>
          <p>Los principales productores de este tipo de información es la <b>comunidad científica</b> vinculada tanto a Institutos de Investigación como a Instituciones Académicas. Una <b>batería mínima de Indicadores de Biodiversidad</b> a nivel nacional es acordada por el SINA bajo el liderazgo del Ministerio de Medio Ambiente y Desarrollo Sostenible y otros indicadores de biodiversidad se encuentran en el <b>Plan Estadístico Nacional</b> liderado por el DANE. </p>
        </div>
        <div className="content cont4">
          <h1>¿Qué encuentras en esta módulo?</h1>
          <p>Esta sitio contiene un tablero de control de indicadores de Biodiversidad para Colombia. Acá podrás <b>buscar indicadores</b> de acuerdo a objetivos de conservación y desarrollo sostenible y podrás visualizar el avance logrado en cada objetivo. Puedes <b>explorar los indicadores</b> asociados a un área geográfica específica: áreas protegidas, ecosistemas o áreas administrativas y puedes relacionar o <b>interpretar varios indicadores</b> en contextos específicos bajo el marco de Presión, Estado, Respuesta y Beneficios. Para cada indicador encontrarás <b>información que facilita su interpretación y uso</b> para la gestión de la biodiversidad en Colombia.</p>
        </div>
      </div>

      <div className="compcont invisible">
        <div className="content cont1">
          <h1>¿Qué es el módulo de compensación?</h1>
          <p>Las compensaciones ambientales son un instrumento para compensar la pérdida de biodiversidad. El módulo de compensaciones es una herramienta que permite a las empresas encontrar opciones de respuestas a cuatro preguntas: <b>¿Qué compensar?, ¿Cuánto compensar?, ¿Dónde compensar? y ¿Cómo compensar?</b>, este puede ser usado para proyectos licenciados, en licenciamiento o en diagnóstico de alternativas. </p>
        </div>
        <div className="content cont2">
          <h1>¿Por qué la compensación?</h1>
          <p>En 2018 el Ministerio de Ambiente y Desarrollo Sostenible publica la <b>segunda versión del manual de compensaciones por pérdida de biodiversidad</b>. Esta actualización incluye, entre otras modificaciones, un cálculo nuevo para los factores de compensación y la opción de agrupamiento de compensaciones en proyectos lineales. La aplicación del manual requiere la consulta a múltiples fuentes de información y su análisis en los contextos particulares de cada proyecto. El módulo de compensaciones es necesario porque facilita que las empresas <b>visualicen diferentes alternativas de compensación y creen portafolios con opciones que cumplan con la normatividad vigente</b>. A su vez, el módulo de compensaciones incorpora análisis regionales y nacionales, lo cual potencia la efectividad de las compensaciones a nivel nacional.</p>
        </div>
        <div className="content cont3">
          <h1>¿Quién produce los análisis necesarios?</h1>
          <p>La información que se despliega en el módulo de compensaciones es generada a partir de <b>cartografía oficial</b> que es analizada por el programa de <b>Gestión Territorial del Instituto Humboldt</b> aplicando el manual de compensaciones de 2018.</p>
        </div>
        <div className="content cont4">
          <h1>¿Qué encuentras en esta módulo?</h1>
          <p>En el modulo de compensaciones encuentras respuesta a <b>¿Qué compensar?, ¿Cuánto compensar?, ¿Dónde compensar? y ¿Cómo compensar?</b>, estas respuestas se generan a partir de información previamente analizada para el proyecto que se está consultando. En este módulo la empresa encontrará la descripción de los <b>ecosistemas equivalentes afectados, el número total de hectáreas a compensar, propuesta de agrupaciones de compensaciones, y estrategias de cómo compensar</b>: restauración, recuperación, rehabilitación dentro y fuera de áreas SINAP, preservación y declaratoria de nuevas áreas protegidas. El usuario puede seleccionar entre las opciones ofrecidas hasta alcanzar las hectáreas totales a compensar, con lo cual construirá un portafolio inicial de opciones de compensación.</p>
        </div>
      </div>

      <div className="alertcont invisible">
        <div className="content cont1">
          <h1>¿Qué son las alertas tempranas?</h1>
          <p>Los indicadores de biodiversidad son <b>medidas</b> que nos hablan sobre <b>aspectos particulares de la biodiversidad,</b> algunos la cuantifican, otros se refieren a su condición, otros dimensionan las presiones que la afectan. Una característica importante de los indicadores es <b>que se encuentren relacionados con un contexto particular</b> en el que puedan ser utilizados para apoyar la toma de decisiones ambientales. Por ejemplo, la cifra sobre riqueza de especies (número de especies presentes en un lugar y tiempo determinado) no es un indicador si no se encuentra asociado con una <b>“historia” y un objetivo particular,</b> es así como la riqueza de especies se convierte en un indicador cuando nuestro objetivo es, por ejemplo, representar en las Áreas Protegidas al menos el 80% de las especies conocidas presentes en Colombia y utilizamos la riqueza como una medida que se repite a través del tiempo para cuantificar el avance hacia el objetivo planteado.</p>
        </div>
        <div className="content cont2">
          <h1>¿Por qué son importantes los alertas tempranas?</h1>
          <p>Los indicadores son una herramienta que <b>provee información robusta</b> sobre el estado actual de la biodiversidad y sus tendencias. Al ser información medible, cuantificable y periódica los indicadores <b>permiten evaluar cómo está nuestra biodiversidad y cómo se ve o verá afectada</b> bajo diferentes escenarios de manejo o gestión. Los indicadores proveen evidencia científica y contextualizada para entender los cambios en la biodiversidad y sus posibles consecuencias para el bienestar humano, <b>convirtiéndose en herramientas poderosas para tomar decisiones ambientales informadas.</b></p>
        </div>
        <div className="content cont3">
          <h1>¿Quién genera las alertas tempranas?</h1>
          <p>Los principales productores de este tipo de información es la <b>comunidad científica</b> vinculada tanto a Institutos de Investigación como a Instituciones Académicas. Una <b>batería mínima de Indicadores de Biodiversidad</b> a nivel nacional es acordada por el SINA bajo el liderazgo del Ministerio de Medio Ambiente y Desarrollo Sostenible y otros indicadores de biodiversidad se encuentran en el <b>Plan Estadístico Nacional</b> liderado por el DANE. </p>
        </div>
        <div className="content cont4">
          <h1>¿Qué encuentras en esta módulo?</h1>
          <p>Esta sitio contiene un tablero de control de indicadores de Biodiversidad para Colombia. Acá podrás <b>buscar indicadores</b> de acuerdo a objetivos de conservación y desarrollo sostenible y podrás visualizar el avance logrado en cada objetivo. Puedes <b>explorar los indicadores</b> asociados a un área geográfica específica: áreas protegidas, ecosistemas o áreas administrativas y puedes relacionar o <b>interpretar varios indicadores</b> en contextos específicos bajo el marco de Presión, Estado, Respuesta y Beneficios. Para cada indicador encontrarás <b>información que facilita su interpretación y uso</b> para la gestión de la biodiversidad en Colombia.</p>
        </div>
      </div>
    </div>
  );
}
}

export default Information;
