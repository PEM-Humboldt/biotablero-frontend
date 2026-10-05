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
    renderingReport: {
      title: "Creando el reporte...",
      description:
        "En un momento se abrirá el diálogo para que guardes tu reporte.",
    },
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

  leaveAlert: {
    title: "¿Deseas salir de la página?",
    description:
      "Tienes un reporte generado sin descargar. Si sales ahora, perderás los cambios.",
    cancel: "Permanecer en la página",
    confirm: "Salir de todas formas",
  },

  documentTree: {
    noData: "No hay información para generar el reporte",
    section: {
      graphListSr: "Gráficos de esta sección",
      graphTitle: (graphId: string) => `Gráfica: ${graphId}`,
      noteSr: (graphId: string) => `Nota sobre la gráfica ${graphId}`,
    },
    edition: {
      graph: {
        previewBtn: {
          sr: "Vista previa de la gráfica",
          title: "Vista previa de la gráfica",
          label: "",
        },
        zoomHrefTitle: "Haz clic para abrir a tamaño completo",
        zoomImgAlt: "Vista previa gráfica",
      },
      map: {
        previewBtn: {
          sr: "Vista previa de mapa",
          title: "Vista previa de mapa",
          label: "",
        },
        zoomHrefTitle: "Haz clic para ver todo el mapa",
        zoomImgAlt: "Vista previa del mapa",
      },
      note: {
        editBtn: {
          title: (hasNote: boolean) =>
            hasNote ? "Actualizar nota" : "Agregar nota",
          sr: (hasNote: boolean) =>
            hasNote ? "Actualizar nota" : "Agregar nota",
          label: "",
        },
        input: {
          placeholder: "Mis observaciones...",
          saveBtn: { sr: "Grabar cambios", title: "Grabar", label: "Grabar" },
          cancelBtn: { sr: "Cancelar", title: "Cancelar", label: "Cancelar" },
        },
      },
      order: {
        moveUp: {
          sr: "poner antes en el informe",
          title: "poner antes en el informe",
          label: "",
        },
        moveDown: {
          sr: "poner despues en el informe",
          title: "poner despues en el informe",
          label: "",
        },

        remove: {
          sr: (isSection: boolean) =>
            isSection ? "Borrar sección" : "Borrar gráfica",
          title: (isSection: boolean) =>
            isSection ? "Borrar sección" : "Borrar gráfica",
          label: "",
        },
      },
    },
  },
};
