export const uiText = {
  error: {
    critical: {
      user: "Error crítico al procesar la solicitud.",
      console: "Critical error:",
    },

    changeJoinRequestStatus: "No fue posible realizar la acción",

    fetchJoinRequest: "No fue posible obtener una o varias iniciativas",
  },

  module: {
    title: "Solicitudes de ingreso",
    loading: "Cargando solicitudes...",
    empty: "Sin solicitudes",
    actionsOnRequest: {
      colTitle: "accion a realizar",
      aprove: "aceptar solicitud",
      reject: "rechazar solicitud",
    },
    filteringLabels: {
      aproved: "Aprobadas",
      rejected: "Rechazadas",
      underReview: "Pendientes",
    },
    tableParams: {
      dateLabel: {
        pending: "Fecha de solicitud",
        resolved: "Fecha de resolución",
      },
      datePrefix: {
        pending: "solicitado el",
        resolved: "solicitud resuelta el",
      },
      cellTitle: {
        pending: "solicita el ingreso a la iniciativa:",
        resolved: "solicitó el ingreso a la iniciativa:",
      },
    },
    actionsResolved: {
      colTitle: "solicitud resuelta por",
      resolvedBy: (name: string) => `${name} resolvió esta solicitud`,
    },
  },

  toast: {
    aproved: {
      title: "Solicitud aprobada",
      description: (name: string, initiative: string) =>
        `Has aprobado la solicitud de ${name} para ingresar a ${initiative}`,
    },
    rejected: {
      title: "Solicitud rechazada",
      description: (name: string, initiative: string) =>
        `Has rechazado la solicitud de ${name} para ingresar a ${initiative}`,
    },
  },
};
