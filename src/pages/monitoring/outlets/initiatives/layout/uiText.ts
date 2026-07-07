// import { uiText } from "pages/monitoring/outlets/initiatives/layout/uiText";

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
        sr: "Escribenos un correo",
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
};
