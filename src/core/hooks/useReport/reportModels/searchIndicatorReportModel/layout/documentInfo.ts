export const documentInfo = {
  title: (searchArea: string) => `Reporte de indicadores — ${searchArea}`,
  author: (name: string, email: string) => `${name}, mail: ${email}`,
  subject: "Consultas Geográficas · BioTablero",

  coverPage: {
    bookmarkTitle: "Reporte personalizado de Consultas Geográficas",
    subject: "Reporte de indicadores · Consultas Geográficas",
    madeInDate: "Generado",
    madeInBy: "Elaborado por",
    madeInByContact: "Contacto",
    indicatorsAmount: "Indicadores",
  },

  aboutSearch: {
    header: "Polígono consultado",
    stats: {
      polygonType: "Tipo de polígono",
      areaLabel: "Área del polígono",
      areaUnit: " ha",
    },
    searchUrlLabel: "Enlace",
  },

  SearchSection: {
    indicatorMapLabel: "Mapa del indicador",
    grapMapLabel: (graphName: string) => `Mapa para ${graphName}`,
    metricsInGraphLabel: (graphName: string) => `Gráfica para '${graphName}'`,
    dataInLabel: (graphName: string) => `Datos para '${graphName}'`,
    userNoteTitleLabel: (userName: string) => `Anotación de ${userName}`,
    sectionDescriptionLabel: "¿Qué dice este indicador?",
    methodologyLabel: "Metodología",
    interpretationLabel: "Interpretación",
    considerationsLabel: "Consideraciones",
    authorshipLabel: "Autoría",
  },

  credits: {
    about: "Información sobre el reporte",
    madeBy: "Elaborado por:",
    searchUrl: "Enlace al polígono consultado",
    contact: "Contacto",
    disclaimer: {
      title: "Aviso legal",
      content: `Este reporte fue generado automáticamente desde el Módulo de Monitoreo Comunitario de BioTablero a partir de la información aportada por la iniciativa y validada por el Instituto de Investigación de Recursos Biológicos Alexander von Humboldt. Las cifras corresponden a la fecha de generación y pueden actualizarse. Los datos de monitoreo comunitario reflejan el conocimiento del territorio de las comunidades participantes. El uso, reproducción o cita de esta información debe reconocer a la iniciativa autora y al Instituto Humboldt. BioTablero — biotablero.humboldt.org.co`,
    },
  },
};
