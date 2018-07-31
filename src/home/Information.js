import React from 'react';
import Element from './InfoButton';
import Description from './Description';
// import '../common/ScriptHome';
var $ = require ('jquery');

function showDiv(currentElement) {
  $(".content").css("display", "none");
  $(".cont1").css("display", "block");
}

function showDiv2(currentElement) {
  $(".content").css("display", "none");
  $(".cont2").css("display", "block");
}

function showDiv3(currentElement) {
  $(".content").css("display", "none");
  $(".cont3").css("display", "block");
}

function showDiv4(currentElement) {
  $(".content").css("display", "none");
  $(".cont4").css("display", "block");
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
        <button className="btnhome active" onClick={showDiv(this)}><b>01</b> ¿Qué es?</button>
        <button className="btnhome" onClick={showDiv2(this)}><b>02</b> ¿Por qué?</button>
        <button className="btnhome" onClick={showDiv3(this)}><b>03</b> ¿Quién produce?</button>
        <button className="btnhome" onClick={showDiv4(this)}><b>04</b> ¿Qué encuentras?</button>
      </menu>
      <div className="geocont invisible">
        <div className="content cont1">
          <h1>¿Qué son las consultas geográficas?</h1>
          <p>Las consultas geográficas permiten visualizar información existente para unos límites geográficos predeterminados. Técnicamente es una sobreposición de información geográfica, en donde dada una entrada definida por el usuario, por ejemplo, un departamento, una cuenta hidrográfica, una jurisdicción ambiental, se busca la información disponible en el Instituto Humboldt y se presenta una síntesis para las siguientes temáticas: ecología del paisaje, especies y ecosistemas.</p>
        </div>
        <div className="content cont2">
          <h1>¿Por qué este modulo?</h1>
          <p>Los indicadores son una herramienta que <b>provee información robusta</b> sobre el estado actual de la biodiversidad y sus tendencias. Al ser información medible, cuantificable y periódica los indicadores <b>permiten evaluar cómo está nuestra biodiversidad y cómo se ve o verá afectada</b>  c <b>convirtiéndose en herramientas poderosas para tomar decisiones ambientales informadas.</b></p>
        </div>
        <div className="content cont3">
          <h1>¿Quién produce los indicadores de biodiversidad?</h1>
          <p>Los principales productores de este tipo de información es la <b>comunidad científica</b> vinculada tanto a Institutos de Investigación como a Instituciones Académicas. Una <b>batería mínima de Indicadores de Biodiversidad</b> a nivel nacional es acordada por el SINA bajo el liderazgo del Ministerio de Medio Ambiente y Desarrollo Sostenible y otros indicadores de biodiversidad se encuentran en el <b>Plan Estadístico Nacional</b> liderado por el DANE. </p>
        </div>
        <div className="content cont4">
          <h1>¿Qué encuentras en esta sitio? </h1>
          <p>Esta sitio contiene un tablero de control de indicadores de Biodiversidad para Colombia. Acá podrás <b>buscar indicadores</b> de acuerdo a objetivos de conservación y desarrollo sostenible y podrás visualizar el avance logrado en cada objetivo. Puedes <b>explorar los indicadores</b> asociados a un área geográfica específica: áreas protegidas, ecosistemas o áreas administrativas y puedes relacionar o <b>interpretar varios indicadores</b> en contextos específicos bajo el marco de Presión, Estado, Respuesta y Beneficios. Para cada indicador encontrarás <b>información que facilita su interpretación y uso</b> para la gestión de la biodiversidad en Colombia.</p>
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
          <h1>¿Qué encuentras en esta sitio? </h1>
          <p>Esta sitio contiene un tablero de control de indicadores de Biodiversidad para Colombia. Acá podrás <b>buscar indicadores</b> de acuerdo a objetivos de conservación y desarrollo sostenible y podrás visualizar el avance logrado en cada objetivo. Puedes <b>explorar los indicadores</b> asociados a un área geográfica específica: áreas protegidas, ecosistemas o áreas administrativas y puedes relacionar o <b>interpretar varios indicadores</b> en contextos específicos bajo el marco de Presión, Estado, Respuesta y Beneficios. Para cada indicador encontrarás <b>información que facilita su interpretación y uso</b> para la gestión de la biodiversidad en Colombia.</p>
        </div>
      </div>

      <div className="compcont invisible">
        <div className="content cont1">
          <h1>¿Qué es el modulo de compensación?</h1>
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
          <h1>¿Qué encuentras en esta sitio? </h1>
          <p>Esta sitio contiene un tablero de control de indicadores de Biodiversidad para Colombia. Acá podrás <b>buscar indicadores</b> de acuerdo a objetivos de conservación y desarrollo sostenible y podrás visualizar el avance logrado en cada objetivo. Puedes <b>explorar los indicadores</b> asociados a un área geográfica específica: áreas protegidas, ecosistemas o áreas administrativas y puedes relacionar o <b>interpretar varios indicadores</b> en contextos específicos bajo el marco de Presión, Estado, Respuesta y Beneficios. Para cada indicador encontrarás <b>información que facilita su interpretación y uso</b> para la gestión de la biodiversidad en Colombia.</p>
        </div>
      </div>

      <div className="alertcont invisible">
        <div className="content cont1">
          <h1>¿Qué son las alertas tempranas?</h1>
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
          <h1>¿Qué encuentras en esta sitio? </h1>
          <p>Esta sitio contiene un tablero de control de indicadores de Biodiversidad para Colombia. Acá podrás <b>buscar indicadores</b> de acuerdo a objetivos de conservación y desarrollo sostenible y podrás visualizar el avance logrado en cada objetivo. Puedes <b>explorar los indicadores</b> asociados a un área geográfica específica: áreas protegidas, ecosistemas o áreas administrativas y puedes relacionar o <b>interpretar varios indicadores</b> en contextos específicos bajo el marco de Presión, Estado, Respuesta y Beneficios. Para cada indicador encontrarás <b>información que facilita su interpretación y uso</b> para la gestión de la biodiversidad en Colombia.</p>
        </div>
      </div>
    </div>
  );
}
}

export default Information;
