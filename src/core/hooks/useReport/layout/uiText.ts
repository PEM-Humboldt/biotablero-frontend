import { uiText as reportInputTextUi } from "@ui/addMCIndicatorToReport/layout/uiText";

export const uiText = {
  downloadReportError: "Error al generar el pdf:",

  context: {
    addSectionToastSuccess: {
      title: "Agregado al reporte exitosamente",
      description: (title: string) => `${title} se ha agregado al reporte.`,
    },
    removeReportToastSuccess: {
      title: "Reporte descartado",
      description: "El reporte ha sido descartado correctamente",
    },
    removeSectionToastSuccess: (sectionName: string) => ({
      title: "Sección eliminada",
      description: `${sectionName} se ha eliminado del reporte.`,
    }),
    removeGraphToastSuccess: (graphId: string) => ({
      title: "Gráfica eliminada",
      description: `${graphId} se ha eliminado del reporte.`,
    }),
    utils: {
      mapErrorSerialize: "No fue posible crear el mapa solicitado",
      graphErrorSerialize: "No fue posible crear el gráfico solicitado",
    },
  },

  editor: {
    header: {
      title: "Editor de reportes",
      description:
        "Este es el esquema actual del reporte con la información que has añadido, acá puedes cambiar el orden de las secciones y las gráficas, agregar o eliminar notas, gráficas y secciones.",
    },
    footer: {
      input: reportInputTextUi.downloadDialog.input,
      downloadBtn: reportInputTextUi.downloadDialog.downloadBtn,
      closeBtn: {
        title: "Cerrar editor",
        sr: "Cerrar editor",
        label: "Cerrar",
      },
      deleteBtn: {
        title: "Borrar el reporte",
        sr: "Borrar el reporte",
        label: "Borrar",
      },
    },
  },
};
