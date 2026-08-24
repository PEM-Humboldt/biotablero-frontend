export const documentInfo = {
  title: (initiativeName: string) =>
    `Reporte de indicadores — ${initiativeName}`,
  author: (name: string, email: string) => `${name}, mail: ${email}`,
  subject: "Monitoreo Comunitario · BioTablero",

  coverPage: {
    bookmarkTitle: "Reporte personalizado de Monitoreo Comunitario",
    subject: "Reporte de indicadores · Monitoreo Comunitario",
    initiativeContext: (locations: string, since: string) =>
      `${locations} · Desde ${since}`,
    madeInDate: "Generado",
    madeInBy: "Elaborado por",
    indicatorsAmount: "Indicadores",
  },

  aboutInitiative: {
    header: "Perfil de la iniciativa",
    stats: {
      areaLabel: "Área bajo monitoreo comunitario",
      localitieslabel: "Municipios monitoreados",
      monitoringEventslabel: "Eventos de monitoreo",
    },
    creationDateLabel: "Fecha de creación",
    locationLabel: "Ubicación",
    initiativeUrlLabel: "Enlace",
    tagsLabel: {
      political: "Vínculos institucionales",
      social: "Vínculos con la sociedad civil",
    },
  },

  indicatorSection: {
    creationDateLabel: "Creación",
    lastUpdateLabel: "Última actualización",
    indicatorUrlLabel: "enlace",
    tagsLabel: {
      ecosystem: "Ecosistemas estratégicos",
      biologicalGroup: "Escala biológica",
    },
    indicatorMapLabel: "Mapa del indicador",
    grapMapLabel: (graphName: string) =>
      `Mapa del indicador para los valores de ${graphName}`,
    metricsInGraphLabel: (graphName: string) =>
      `Gráfica del indicador para los valores '${graphName}'`,
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
    contact: "Contacto",
    disclaimer: {
      title: "Aviso legal",
      content: `Este reporte fue generado automáticamente desde el Módulo de Monitoreo Comunitario de BioTablero a partir de la información aportada por la iniciativa y validada por el Instituto de Investigación de Recursos Biológicos Alexander von Humboldt. Las cifras corresponden a la fecha de generación y pueden actualizarse. Los datos de monitoreo comunitario reflejan el conocimiento del territorio de las comunidades participantes. El uso, reproducción o cita de esta información debe reconocer a la iniciativa autora y al Instituto Humboldt. BioTablero — biotablero.humboldt.org.co`,
    },
  },
};
