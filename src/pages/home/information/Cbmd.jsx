import React from 'react';

const descriptions = {
  queEs: {
    title: '¿Qué es?',
    description: (
      <p>
        {'Esta herramienta surge como una iniciativa para compartir los '}
        <b>
          resultados del monitoreo comunitario de Variables Esenciales de Biodiversidad (VEB)
        </b>
        {' en Montes de María. Consiste en un conjunto de gráficos que resumen la información recolectada en campo por tres asociaciones comunitarias de la zona, a partir de '}
        <b>
          siete metodologías de monitoreo
        </b>
        {' planteadas según sus metas para el territorio. Está basado en la ruta de monitoreo presentada en el libro “'}
        <a className="linkText" target="_blank" rel="noreferrer" href="http://repository.humboldt.org.co/handle/20.500.11761/35586">
          Monitoreo comunitario de la biodiversidad en Montes de María
        </a>
        ”
      </p>
    ),
  },
  porque: {
    title: '¿Por qué este módulo?',
    description: (
      <p>
        {'Dado que uno de los pasos más difíciles de implementar en las estrategias de monitoreo comunitario es el '}
        <b>
          análisis de los datos,
        </b>
        {' se espera que esta herramienta ponga a disposición de las comunidades los resultados de la recolección de información que realizan ellos en campo, por medio de '}
        <b>
          gráficos que sintetizan
        </b>
        {' lo que van obteniendo con el tiempo. '}
      </p>
    ),
  },
  quienProduce: {
    title: '¿Quién lo produce?',
    description: (
      <p>
        {'Tres asociaciones comunitarias de agricultores, mujeres y hombres, víctimas del conflicto armado del departamento de Bolívar. '}
        <b>
          La Asociación de Mujeres Unidas de San Isidro (AMUSI)
        </b>
        {' compuesta por más de 30 familias del corregimiento San Isidro en el municipio El Carmen de Bolívar. '}
        <b>
          La Asociación Integral de Campesinos de Cañito (ASICAC)
        </b>
        {', conformada por más de 40 familias de la vereda Cañito, en el municipio de San Juan Nepomuceno. '}
        <b>
          La Asociación de Productores Agropecuarios de la vereda Brasilar (ASOBRASILAR)
        </b>
        , compuesta por 25 asociados.
      </p>
    ),
  },
  queEncuentras: {
    title: '¿Qué encuentras en este sitio?',
    description: (
      <p>
        {'Este sitio contiene gráficos de '}
        <b>
          resumen de la información recolectada por las asociaciones
        </b>
        {' para las siete metodologías propuestas en el libro “Monitoreo comunitario de la biodiversidad en Montes de María” Los datos son subidos a la web por los monitores encargados por medio de '}
        <a className="linkText" target="_blank" rel="noreferrer" href="https://www.kobotoolbox.org/">
          KoBoToolbox
        </a>
        {' a partir de los formatos diligenciados en físico. Además, se puede encontrar un '}
        <b>
          indicador del estado del monitoreo
        </b>
        {' según los compromisos anuales, la metodología y la asociación.'}
      </p>
    ),
  },
};

export default descriptions;
