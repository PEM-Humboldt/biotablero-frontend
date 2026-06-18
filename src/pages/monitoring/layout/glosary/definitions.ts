export const definitions: {
  word: string;
  definition: string;
  categories: string[];
}[] = [
  {
    word: "Monitoreo",
    definition:
      "Observaciones ordenadas y repetidas de aspectos de la biodiversidad en diferentes lugares a través del tiempo.",
    categories: ["Conceptos de monitoreo"],
  },
  {
    word: "Indicador",
    definition:
      "Medidas que nos permiten evaluar el avance logrado hacia el cumplimiento de una meta o el estado y tendencias de la biodiversidad en un contexto específico.",
    categories: ["Conceptos de monitoreo"],
  },
  {
    word: "Iniciativa",
    definition:
      "Colectivo de personas y entidades que se organizan para monitorear la biodiversidad en su territorio desde un enfoque comunitario.",
    categories: ["Conceptos de monitoreo"],
  },
  {
    word: "Área de estudio",
    definition:
      "Territorios específicos donde se lleva a cabo el monitoreo de biodiversidad y sobre los cuales se quieren responder preguntas.",
    categories: ["Conceptos de monitoreo"],
  },
  {
    word: "Evento de monitoreo",
    definition:
      "Cada jornada en donde los monitores registran o miden los aspectos de la biodiversidad que están siguiendo en sus territorios. Los eventos pueden ser cortos, por ejemplo, un recorrido para contar aves, o largos, por ejemplo, cuando se deja una cámara trampa en el mismo punto durante 45 días.",
    categories: ["Conceptos de monitoreo"],
  },

  {
    word: "Escala biológica",
    definition:
      "Para poder explicar la complejidad de la naturaleza, los científicos la dividen en niveles que van desde las unidades más pequeñas que conforman los seres vivos, hasta las unidades más grandes en donde estos vivimos. El monitoreo se puede realizar en cualquiera de estos niveles, y podemos elegir indicadores que hablen de su composición (de qué está hecho), estructura (cómo está organizado) y función (qué procesos están ocurriendo).",
    categories: ["Indicadores y escala"],
  },
  {
    word: "Indicadores a escala de genes",
    definition:
      "Cuando obtenemos muestras de tejidos de varios individuos y generamos secuencias de su material genético para después comparar con otros.",
    categories: ["Indicadores y escala"],
  },
  {
    word: "Indicadores a escala de población",
    definition:
      "Cuando monitoreamos varios individuos de la misma especie en la misma época y lugar, por ejemplo, contamos cuantas guacamayas rojas visitan cada día un bosque.",
    categories: ["Indicadores y escala"],
  },
  {
    word: "Indicadores a escala de comunidad",
    definition:
      "Cuando monitoreamos varios individuos de varias especies en la misma época y lugar, por ejemplo, contamos todas las especies de aves y mamíferos que visitan cada día un bosque.",
    categories: ["Indicadores y escala"],
  },
  {
    word: "Indicadores a escala de ecosistemas",
    definition:
      "Cuando extendemos el monitoreo a los componentes no vivos de los lugares que estamos monitoreando, por ejemplo, midiendo la profundidad y calidad de agua en una laguna.",
    categories: ["Indicadores y escala"],
  },
  {
    word: "Indicadores a escala de paisaje",
    definition:
      "Cuando monitoreamos varios ecosistemas que coexisten en un mismo territorio, por ejemplo, midiendo el área de bosque, potrero y humedal en una vereda.",
    categories: ["Indicadores y escala"],
  },
  {
    word: "Indicadores socioecológicos",
    definition:
      "Cuando monitoreamos algún aspecto de la relación entre la biodiversidad y las personas; por ejemplo las prácticas de manejo del territorio o de uso de especies.",
    categories: ["Indicadores y escala"],
  },

  {
    word: "Ecosistema estratégico",
    definition:
      "Un tipo de ambiente natural cuya conservación es especialmente importante tanto para la biodiversidad como para el bienestar de las personas. En Colombia, algunos están reconocidos por ley a nivel nacional, por ejemplo el bosque seco tropical y el páramo; mientras que otros, se consideran estratégicos por su valor a escala local, por ejemplo el bosque húmedo tropical y las sabanas naturales.",
    categories: ["Ecosistemas estratégicos"],
  },
  {
    word: "Bosque húmedo tropical",
    definition:
      "Ecosistema forestal caracterizado por altas temperaturas y precipitaciones abundantes sin estaciones secas marcadas, clave en el mantenimiento del clima, la biodiversidad y el bienestar del planeta.",
    categories: ["Ecosistemas estratégicos"],
  },
  {
    word: "Bosque seco tropical",
    definition:
      "Ecosistema forestal caracterizado por una marcada estacionalidad con períodos de sequía prolongados, uno de los más amenazados del planeta.",
    categories: ["Ecosistemas estratégicos"],
  },
  {
    word: "Humedales",
    definition:
      "Zonas donde el agua es el principal factor que controla el ambiente, incluyendo pantanos, ciénagas, lagunas y manglares, esenciales para la filtración del agua y la mitigación de inundaciones.",
    categories: ["Ecosistemas estratégicos"],
  },
  {
    word: "Páramos",
    definition:
      "Ecosistemas de alta montaña tropical ubicados sobre el límite del bosque, fundamentales para la regulación hídrica y el almacenamiento de carbono.",
    categories: ["Ecosistemas estratégicos"],
  },
  {
    word: "Arrecifes de coral",
    definition:
      "Estructuras marinas formadas por colonias de corales que albergan una extraordinaria biodiversidad y protegen las costas de la erosión.",
    categories: ["Ecosistemas estratégicos"],
  },
  {
    word: "Pastos marinos",
    definition:
      "Praderas submarinas de plantas con flores que crecen en aguas costeras poco profundas, sirviendo como zonas de cría y alimentación para múltiples especies.",
    categories: ["Ecosistemas estratégicos"],
  },
] as const;
