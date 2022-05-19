import React from 'react';

const descriptions = {
  queEs: {
    title: '¿Qué son las consultas geográficas?',
    description: (
      <p>
        {'Las consultas geográficas permiten '}
        <b>
          visualizar información existente para unos límites geográficos predeterminados
        </b>
        .
        {'Técnicamente, es una sobreposición de información geográfica, en donde dada una entrada definida por el usuario, por ejemplo un departamento, una cuenca hidrográfica o una jurisdicción ambiental, se presenta una síntesis de cifras e indicadores para las siguientes temáticas: '}
        <b>
          ecología del paisaje, especies y ecosistemas
        </b>
        .
      </p>
    ),
  },
  porque: {
    title: '¿Por qué este módulo?',
    description: (
      <p>
        {'En Colombia se ha avanzado en la generación de información geográfica sobre temáticas ambientales, económicas y sociales, y en el desarrollo de mecanismos y plataformas para compartirla. El acceso abierto a datos geográficos es una tendencia global. Quien busca información geográfica sobre biodiversidad y ecosistemas puede encontrarla en varias fuentes, en portales nacionales como el SiB Colombia, el SIAC, y en los diferentes portales de datos de los institutos de Investigación o en portales globales como Biodiversity Dashboard o Global Forest Watch, entre otros. El módulo de consultas geográficas en BioTablero es necesario porque '}
        <b>
          permite al usuario tener una lectura rápida de la información más relevante
        </b>
        para su área de interés bajo tres temáticas de biodiversidad: paisajes, especies y
        ecosistemas, simplificando la búsqueda y selección de información pertinente.
      </p>
    ),
  },
  quienProduce: {
    title: '¿Quién selecciona las consultas geográficas?',
    description: (
      <p>
        {'La información que se dispone en BioTablero es generada por múltiples fuentes nacionales e internacionales que disponen sus datos de manera abierta. Sin embargo no toda la información existente está disponible en el BioTablero. Investigadores del Instituto Humboldt seleccionan la '}
        <b>
          información de mayor pertinencia para el entendimiento general del estado de la
          biodiversidad
        </b>
        {' y en conjunto con el grupo de trabajo de BioTablero se procesa para entregar al usuario una visualización gráfica que representa las cifras y patrones más relevantes en su área de interés.'}
      </p>
    ),
  },
  queEncuentras: {
    title: '¿Qué encuentras en este sitio?',
    description: (
      <p>
        {'En las consultas geográficas encuentras '}
        <b>
          mapas, cifras y gráficas
        </b>
        {' que dan cuenta del estado de la biodiversidad en un área geográfica particular bajo tres temáticas'}
        <br />
        <b>
          1) Ecosistemas:
        </b>
        {' Cambio de cobertura en ecosistemas estratégicos, representatividad de ecosistemas en áreas protegidas.'}
        <br />
        <b>
          2) Paisaje:
        </b>
        {' Acá encuentras información relacionada con ecosistemas equivalentes y factores de compensación, métricas de fragmentación y conectividad. '}
        <br />
        <b>
          3) Especies:
        </b>
        {' Acá encuentras cifras sobre número de especies (inferidas y observadas) y vacíos de información para todas las especies, especies amenazadas, endémicas e invasoras.'}
      </p>
    ),
  },
};

export default descriptions;
