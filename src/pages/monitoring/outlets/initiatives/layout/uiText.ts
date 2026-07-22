export const uiText = {
  profile: {
    basicInfo: {
      usersTitle: "Participantes de la iniciativa",
      usersSeparator: ", ",
      creationDateTitle: "Fecha de registro",
      datePrefix: "Desde: ",
      dateLocationSeparator: " // ",
      locationsTitle: "Donde trabaja la iniciativa",
      locationSeparator: " | ",
    },

    stats: {
      errorBase: "Estadísticas no disponibles.",
    },

    tagsAndContact: {
      mailBtn: {
        sr: "Escríbenos un correo",
        title: "",
        label: "Escríbenos",
      },
      ecosystemsTitle: "Ecosistemas estratégicos",
      politicalContextTitle: "Convenios vinculados",
    },

    monitoringEventsGraph: {
      noEvents:
        "La iniciativa todavía no tiene eventos de monitoreo registrados",
      title: (year: number) => `Eventos de monitoreo ${year}`,
      selectYear: {
        sr: "Selecciona un año",
        title: "Selecciona un año",
        placeholder: "Selecciona un año",
      },
    },

    relatedInitiatives: {
      title: "Iniciativas Relacionadas",
      goToBtn: {
        label: "Ir a la iniciativa",
        sr: "Ir a la iniciativa",
        title: "Ir a la iniciativa",
      },
    },
  },

  collaborators: {
    title: "Colaboradores de la iniciativa",
    descriptionMd:
      "Los participantes del monitoreo comunitario combinan conocimiento local con apoyo técnico e institucional. Involucra líderes, voluntarios y grupos sociales que aportan su experiencia territorial, así como instituciones locales que facilitan recursos. También participan ONGs, universidades y entidades especializadas con metodologías y capacitación. La articulación de todos garantiza un monitoreo integral, participativo y útil para la toma de decisiones colectivas.",
    noCollaborators:
      "No es posible mostrar a las y los colaboradores en este momento",
    joininInfo: (fromDate: string, role: string) => `${role} desde ${fromDate}`,
  },
};
