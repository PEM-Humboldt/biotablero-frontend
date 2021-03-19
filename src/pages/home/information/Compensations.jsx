import React from 'react';

const descriptions = {
  queEs: {
    title: '¿Qué es el módulo de compensación?',
    description: (
      <p>
        {'Las compensaciones ambientales son un instrumento para compensar la pérdida de biodiversidad. El módulo de compensaciones es una herramienta que permite a las empresas encontrar opciones de respuestas a cuatro preguntas: '}
        <b>
          ¿Qué compensar?, ¿Cuánto compensar?, ¿Dónde compensar? y ¿Cómo compensar?
        </b>
        , este puede ser usado para proyectos licenciados, en licenciamiento o en
        diagnóstico de alternativas.
      </p>
    ),
  },
  porque: {
    title: '¿Por qué la compensación?',
    description: (
      <p>
        {'En 2018 el Ministerio de Ambiente y Desarrollo Sostenible publica la '}
        <b>
          segunda versión del manual de compensaciones por pérdida de biodiversidad
        </b>
        {'. Esta actualización incluye, entre otras modificaciones, un cálculo nuevo para los factores de compensación y la opción de agrupamiento de compensaciones en proyectos lineales. La aplicación del manual requiere la consulta a múltiples fuentes de información y su análisis en los contextos particulares de cada proyecto. El módulo de compensaciones es necesario porque facilita que las empresas '}
        <b>
          visualicen diferentes alternativas de compensación y creen portafolios con opciones
          que cumplan con la normatividad vigente
        </b>
        . A su vez, el módulo de compensaciones incorpora análisis regionales y nacionales, lo
        cual potencia la efectividad de las compensaciones a nivel nacional.
      </p>
    ),
  },
  quienProduce: {
    title: '¿Quién produce los análisis necesarios?',
    description: (
      <p>
        {'La información que se despliega en el módulo de compensaciones es generada a partir de '}
        <b>
          cartografía oficial
        </b>
        {' que es analizada por el programa de '}
        <b>
          Gestión Territorial del Instituto Humboldt
        </b>
        {' aplicando el manual de compensaciones de 2018.'}
      </p>
    ),
  },
  queEncuentras: {
    title: '¿Qué encuentras en este módulo?',
    description: (
      <p>
        {'En el modulo de compensaciones encuentras respuesta a '}
        <b>
          ¿Qué compensar?, ¿Cuánto compensar?, ¿Dónde compensar? y ¿Cómo compensar?
        </b>
        {', estas respuestas se generan a partir de información previamente analizada para el proyecto que se está consultando. En este módulo la empresa encontrará la descripción de los '}
        <b>
          ecosistemas equivalentes afectados, el número total de hectáreas a compensar,
          propuesta de agrupaciones de compensaciones, y estrategias de cómo compensar
        </b>
        : restauración, recuperación, rehabilitación dentro y fuera de áreas SINAP,
        preservación y declaratoria de nuevas áreas protegidas. El usuario puede seleccionar
        entre las opciones ofrecidas hasta alcanzar las hectáreas totales a compensar, con lo
        cual construirá un portafolio inicial de opciones de compensación.
      </p>
    ),
  },
};

export default descriptions;
