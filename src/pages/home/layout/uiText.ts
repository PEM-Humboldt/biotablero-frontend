// NOTE: Old images for reference
// import whatIs from "pages/home/assets/biotablero-icono.svg";
// import whomIsItFor from "pages/home/assets/a-quien-va-dirigido.svg";
// import whoDoesIt from "pages/home/assets/quien-lo-hace.svg";
// import ourGoal from "pages/home/assets/cual-es-nuestro-objetivo.svg";

import {
  ArrowDownUp,
  ChartColumnBig,
  Goal,
  Speech,
  type LucideProps,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

type ModuleIcon =
  | string
  | ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;

type HomeUiText = {
  main: {
    title: string;
    cards: { title: string; image: ModuleIcon; content: string }[];
  };
  tabs: {
    [key: number]: {
      title: string;
      sections: { title: string; content: string }[];
    };
  };
};

export const uiText: HomeUiText = {
  main: {
    title: "Cifras e Indicadores sobre Biodiversidad",
    cards: [
      {
        title: "¿Qué es BioTablero?",
        image: ChartColumnBig,
        content:
          "BioTablero reúne herramientas web para consultar cifras e indicadores y facilitar la toma de decisiones sobre biodiversidad, llevando a autoridades ambientales y empresas privadas síntesis de la información existente, actualizada y confiable en un contexto regional y nacional.",
      },
      {
        title: "¿A quién va dirigido?",
        image: ArrowDownUp,
        content:
          "Usuarios que requieren información actualizada, oportuna y confiable sobre el estado de la biodiversidad, con el fin de utilizarla en la toma de decisiones estratégicas para la gestión ambiental y el diseño de políticas eficaces que favorezcan su conservación.",
      },
      {
        title: "¿Quién lo hace?",
        image: Speech,
        content:
          "Socios académicos nacionales e internacionales, junto a gestores públicos y privados, guían la interpretación y uso de información para el manejo de la biodiversidad en Colombia. Investigadores procesan y entregan visualizaciones gráficas de cifras y patrones clave.",
      },
      {
        title: "¿Cuál es nuestro objetivo?",
        image: Goal,
        content:
          "Integrar información detallada y actualizada sobre la biodiversidad colombiana, con el fin de facilitar la toma de decisiones en conservación, planificación y manejo ambiental a todos los niveles de organización, promoviendo políticas más efectivas.",
      },
    ],
  },
  tabs: {
    1: {
      title: "Consultas Geográficas",
      sections: [
        {
          title: "¿Qué es?",
          content:
            "Las consultas geográficas permiten **visualizar información existente para unos límites geográficos predeterminados**.Técnicamente, es una sobreposición de información geográfica, en donde dada una entrada definida por el usuario, por ejemplo un departamento, una cuenca hidrográfica o una jurisdicción ambiental, se presenta una síntesis de cifras e indicadores para las siguientes temáticas: **ecología del paisaje, especies y ecosistemas.**",
        },
        {
          title: "¿Por qué?",
          content:
            "En Colombia se ha avanzado en la generación de información geográfica sobre temáticas ambientales, económicas y sociales, y en el desarrollo de mecanismos y plataformas para compartirla. El acceso abierto a datos geográficos es una tendencia global. Quien busca información geográfica sobre biodiversidad y ecosistemas puede encontrarla en varias fuentes, en portales nacionales como el SiB Colombia, el SIAC, y en los diferentes portales de datos de los institutos de Investigación o en portales globales como Biodiversity Dashboard o Global Forest Watch, entre otros. El módulo de consultas geográficas en BioTablero es necesario porque **permite al usuario tener una lectura rápida de la información más relevante** para su área de interés bajo tres temáticas de biodiversidad: paisajes, especies y ecosistemas, simplificando la búsqueda y selección de información pertinente.",
        },
        {
          title: "¿Quién produce?",
          content:
            "La información que se dispone en BioTablero es generada por múltiples fuentes nacionales e internacionales que disponen sus datos de manera abierta. Sin embargo no toda la información existente está disponible en el BioTablero. Investigadores del Instituto Humboldt seleccionan la **información de mayor pertinencia para el entendimiento general del estado de la biodiversidad** y en conjunto con el grupo de trabajo de BioTablero se procesa para entregar al usuario una visualización gráfica que representa las cifras y patrones más relevantes en su área de interés.",
        },
        {
          title: "¿Qué encuentras?",
          content:
            "En las consultas geográficas encuentras **mapas, cifras y gráficas** que dan cuenta del estado de la biodiversidad en un área geográfica particular bajo tres temáticas:\n\n1. **Ecosistemas:** Cambio de cobertura en ecosistemas estratégicos, representatividad de ecosistemas en áreas protegidas.\n2. **Paisaje:** Acá encuentras información relacionada con ecosistemas equivalentes y factores de compensación, métricas de fragmentación y conectividad.\n3. **Especies:** Acá encuentras cifras sobre número de especies (inferidas y observadas) y vacíos de información para todas las especies, especies amenazadas, endémicas e invasoras.",
        },
      ],
    },
    2: {
      title: "Monitoreo Comunitario",
      sections: [
        {
          title: "¿Qué es?",
          content:
            "Esta herramienta surge como una iniciativa para compartir los resultados del monitoreo comunitario de Variables Esenciales de Biodiversidad (VEB) en Montes de María. Consiste en un conjunto de gráficos que resumen la información recolectada en campo por tres asociaciones comunitarias de la zona, a partir de siete metodologías de monitoreo planteadas según sus metas para el territorio. Está basado en la ruta de monitoreo presentada en el libro [Monitoreo comunitario de la biodiversidad en Montes de María](https://repository.humboldt.org.co/entities/publication/f04cb573-5b25-4ddc-82a7-8ae40afa0f8e)",
        },
        {
          title: "¿Por qué?",
          content:
            "Dado que uno de los pasos más difíciles de implementar en las estrategias de monitoreo comunitario es el **análisis de los datos,** se espera que esta herramienta ponga a disposición de las comunidades los resultados de la recolección de información que realizan ellos en campo, por medio de **gráficos que sintetizan** lo que van obteniendo con el tiempo.",
        },
        {
          title: "¿Quién produce?",
          content:
            "Tres asociaciones comunitarias de agricultores, mujeres y hombres, víctimas del conflicto armado del departamento de Bolívar. **La Asociación de Mujeres Unidas de San Isidro (AMUSI)** compuesta por más de 30 familias del corregimiento San Isidro en el municipio El Carmen de Bolívar. **La Asociación Integral de Campesinos de Cañito (ASICAC)**, conformada por más de 40 familias de la vereda Cañito, en el municipio de San Juan Nepomuceno. **La Asociación de Productores Agropecuarios de la vereda Brasilar (ASOBRASILAR)**, compuesta por 25 asociados.",
        },
        {
          title: "¿Qué encuentras?",
          content:
            "Este sitio contiene gráficos de **resumen de la información recolectada por las asociaciones** para las siete metodologías propuestas en el libro [Monitoreo comunitario de la biodiversidad en Montes de María](http://repository.humboldt.org.co/handle/20.500.11761/35586). Los datos son subidos a la web por los monitores encargados por medio de [KoBoToolbox](https://www.kobotoolbox.org/) a partir de los formatos diligenciados en físico. Además, se puede encontrar un **indicador del estado del monitoreo** según los compromisos anuales, la metodología y la asociación.",
        },
      ],
    },
    3: {
      title: "Indicadores de Biodiversidad",
      sections: [
        {
          title: "¿Qué es?",
          content:
            "Los indicadores de biodiversidad son **medidas** que nos hablan sobre **aspectos particulares de la biodiversidad,** algunos la cuantifican, otros se refieren a su condición, otros dimensionan las presiones que la afectan. Una característica importante de los indicadores es **que se encuentren relacionados con un contexto particular** en el que puedan ser utilizados para apoyar la toma de decisiones ambientales. Por ejemplo, la cifra sobre riqueza de especies (número de especies presentes en un lugar y tiempo determinado) no es un indicador si no se encuentra asociado con una **“historia” y un objetivo particular,** es así como la riqueza de especies se convierte en un indicador cuando nuestro objetivo es, por ejemplo, representar en las Áreas Protegidas al menos el 80% de las especies conocidas presentes en Colombia y utilizamos la riqueza como una medida que se repite a través del tiempo para cuantificar el avance hacia el objetivo planteado.",
        },
        {
          title: "¿Por qué?",
          content:
            "Los indicadores son una herramienta que **provee información robusta** sobre el estado actual de la biodiversidad y sus tendencias. Al ser información medible, cuantificable y periódica los indicadores **permiten evaluar cómo está nuestra biodiversidad y cómo se ve o verá afectada** bajo diferentes escenarios de manejo o gestión. Los indicadores proveen evidencia científica y contextualizada para entender los cambios en la biodiversidad y sus posibles consecuencias para el bienestar humano, **convirtiéndose en herramientas poderosas para tomar decisiones ambientales informadas.**",
        },
        {
          title: "¿Quién produce?",
          content:
            "Los principales productores de este tipo de información son la **comunidad científica** vinculada tanto a Institutos de Investigación como a Instituciones Académicas. Una **batería mínima de Indicadores de Biodiversidad** a nivel nacional es acordada por el SINA bajo el liderazgo del Ministerio de Medio Ambiente y Desarrollo Sostenible, y otros indicadores de biodiversidad se encuentran en el **Plan Estadístico Nacional** liderado por el DANE.",
        },
        {
          title: "¿Qué encuentras?",
          content: `Este sitio contiene gráficos de **resumen de la información recolectada por las asociaciones** para las siete metodologías propuestas en el libro [Monitoreo comunitario de la biodiversidad en Montes de María](http://repository.humboldt.org.co/handle/20.500.11761/35586). Los datos son subidos a la web por los monitores encargados por medio de [KoBoToolbox](https://www.kobotoolbox.org/) a partir de los formatos diligenciados en físico. Además, se puede encontrar un **indicador del estado del monitoreo** según los compromisos anuales, la metodología y la asociación.`,
        },
      ],
    },
    4: {
      title: "Portafolios",
      sections: [
        {
          title: "¿Qué es?",
          content:
            "Los portafolios son un conjunto de **áreas priorizadas** para la conservación que se generan a partir de un método sistemático en el que se buscan soluciones costo efectivas para la conservación y gestión de la biodiversidad, seleccionando áreas donde se **maximiza la conservación a un mínimo costo.**\n\nLas estrategias de conservación para las cuales se desarrollan portafolios incluyen **preservación, restauración y uso sostenible de la biodiversidad.**",
        },
        {
          title: "¿Por qué?",
          content:
            "Los portafolios guían la gestión de la biodiversidad, indicando las áreas de mayor valor para la conservación con las **soluciones más costo efectivas sobre qué y dónde conservar.**\nLa implementación de todo un portafolio en corto tiempo es poco probable, ya que nuevos contextos surgen y la información disponible para establecer prioridades de conservación se **actualiza constantemente**, lo que demanda un **proceso de generación de portafolios dinámico y cíclico en el tiempo.**",
        },
        {
          title: "¿Quién produce?",
          content:
            "Los portafolios de conservación han sido desarrollados con base en **objetivos planteados en acuerdos multilaterales, políticas nacionales y regionales.** Los investigadores del Instituto Humboldt en alianza con diversas instituciones nacionales e internacionales, han utilizado distintas representaciones de la biodiversidad, así como diversos condicionantes para su conservación con el fin de priorizar estas áreas.",
        },
        {
          title: "¿Qué encuentras?",
          content:
            "En este módulo encuentras los **diferentes portafolios a escala nacional** generados desde el Instituto Humboldt. Cada portafolio se basa en distintos objetivos y características de conservación que responden a **contextos de análisis particulares,** por esto no hay un solo portafolio posible, pues la **selección de las áreas depende de los objetivos de conservación**.",
        },
      ],
    },
    5: {
      title: "Compensaciones Ambientales",
      sections: [
        {
          title: "¿Qué es?",
          content:
            "Las compensaciones ambientales son un instrumento para compensar la pérdida de biodiversidad. El módulo de compensaciones es una herramienta que permite a las empresas encontrar opciones de respuestas a cuatro preguntas:\n\n**¿Qué compensar?**, **¿Cuánto compensar?**, **¿Dónde compensar?** y **¿Cómo compensar?**, este puede ser usado para proyectos licenciados, en licenciamiento o en diagnóstico de alternativas.",
        },
        {
          title: "¿Por qué?",
          content:
            "En 2018 el Ministerio de Ambiente y Desarrollo Sostenible publica la **segunda versión del manual de compensaciones por pérdida de biodiversidad**. Esta actualización incluye, entre otras modificaciones, un cálculo nuevo para los factores de compensación y la opción de agrupamiento de compensaciones en proyectos lineales. La aplicación del manual requiere la consulta a múltiples fuentes de información y su análisis en los contextos particulares de cada proyecto.\n\nEl módulo de compensaciones es necesario porque facilita que las empresas **visualicen diferentes alternativas de compensación y creen portafolios con opciones que cumplan con la normatividad vigente**. A su vez, el módulo de compensaciones incorpora análisis regionales y nacionales, lo cual potencia la efectividad de las compensaciones a nivel nacional.",
        },
        {
          title: "¿Quién produce?",
          content:
            "La información que se despliega en el módulo de compensaciones es generada a partir de **cartografía oficial que es analizada por el programa de Gestión Territorial del Instituto Humboldt aplicando el manual de compensaciones de 2018.** ",
        },
        {
          title: "¿Qué encuetras?",
          content:
            "En el modulo de compensaciones encuentras respuesta a **¿Qué compensar?, ¿Cuánto compensar?, ¿Dónde compensar? y ¿Cómo compensar?** estas respuestas se generan a partir de información previamente analizada para el proyecto que se está consultando. En este módulo la empresa encontrará la descripción de los ** ecosistemas equivalentes afectados, el número total de hectáreas a compensar, propuesta de agrupaciones de compensaciones, y estrategias de cómo compensar**        : restauración, recuperación, rehabilitación dentro y fuera de áreas SINAP, preservación y declaratoria de nuevas áreas protegidas. El usuario puede seleccionar entre las opciones ofrecidas hasta alcanzar las hectáreas totales a compensar, con lo cual construirá un portafolio inicial de opciones de compensación.",
        },
      ],
    },
    6: {
      title: "Alertas Tempranas",
      sections: [
        {
          title: "¿Qué es?",
          content:
            "Esta herramienta surge como una iniciativa para compartir los resultados del monitoreo comunitario de Variables Esenciales de Biodiversidad (VEB) en Montes de María. Consiste en un conjunto de gráficos que resumen la información recolectada en campo por tres asociaciones comunitarias de la zona, a partir de siete metodologías de monitoreo planteadas según sus metas para el territorio. Está basado en la ruta de monitoreo presentada en el libro “Monitoreo comunitario de la biodiversidad en Montes de María”",
        },
        {
          title: "¿Por qué?",
          content:
            "Dado que uno de los pasos más difíciles de implementar en las estrategias de monitoreo comunitario es el análisis de los datos, se espera que esta herramienta ponga a disposición de las comunidades los resultados de la recolección de información que realizan ellos en campo, por medio de gráficos que sintetizan lo que van obteniendo con el tiempo.",
        },
        {
          title: "¿Quién produce?",
          content:
            "Tres asociaciones comunitarias de agricultores, mujeres y hombres, víctimas del conflicto armado del departamento de Bolívar. La Asociación de Mujeres Unidas de San Isidro (AMUSI) compuesta por más de 30 familias del corregimiento San Isidro en el municipio El Carmen de Bolívar. La Asociación Integral de Campesinos de Cañito (ASICAC), conformada por más de 40 familias de la vereda Cañito, en el municipio de San Juan Nepomuceno. La Asociación de Productores Agropecuarios de la vereda Brasilar (ASOBRASILAR), compuesta por 25 asociados.",
        },
        {
          title: "¿Qué encuentras?",
          content:
            "Este sitio contiene gráficos de resumen de la información recolectada por las asociaciones para las siete metodologías propuestas en el libro Monitoreo comunitario de la biodiversidad en Montes de María” Los datos son subidos a la web por los monitores encargados por medio de KoBoToolbox a partir de los formatos diligenciados en físico. Además, se puede encontrar un indicador del estado del monitoreo según los compromisos anuales, la metodología y la asociación.",
        },
      ],
    },
  },
};
