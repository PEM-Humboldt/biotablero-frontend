export const uiText = {
  resourseMadeUnderInitiativePrefixSr: "Realizado por la iniciativa ",
  resourcePublicationDatePrefixSr: "Publicado el ",
  resourceDesciptionTitle: "Descripcion",
  resourceTypeSelectorBtn: (resourceTypeName: string) =>
    `Seleccionar tipo de recurso: ${resourceTypeName}`,

  header: {
    legend: "Nuestras experiencias son recursos valiosos",
    button: "Administar mis recursos",
  },

  searchBar: {
    reset: "Reiniciar búsqueda",
    results: (amount: number) =>
      `Recurso${amount !== 1 ? "s " : " "}encontrado${amount !== 1 ? "s " : " "}`,
  },

  tagsTitle: {
    all: "Etiquetas del recurso: ",
    ecosystem: "Escala biológica",
    BiologicalGroup: "Grupo biológico",
  },

  attachmentsTitle: {
    files: "Archivos adjuntos",
    links: "Enlaces relacionados",
  },

  currentResource: {
    closeBtn: { title: "cerrar", sr: "Cerrar recurso" },
    attachmentAction: {
      link: (url: string) => `visitar ${url}`,
      file: (name: string) => `Descargar ${name}`,
    },
  },

  smallCard: {
    title: "Recursos disponibles",
    attachments: {
      title: "Este recuros contiene",
      files: "Archivos para descargar",
      links: "Enlaces externos",
    },
    gotoResource: "ir al recurso",
  },
};
