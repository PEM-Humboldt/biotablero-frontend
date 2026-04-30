export const uiText = {
  resourcesList: {
    title: "Recursos disponibles para edición",
    srCaption: (resourceTypeName: string) =>
      `Recursos sobre ${resourceTypeName} que puedes administrar`,
    headers: ["Nombre", "Iniciativa", "Acciones"],
    madeByOther: (otherName: string | null) =>
      otherName ? ` por ${otherName}` : "",
    edit: { label: "", title: "Editar", sr: "Editar recurso" },
    del: {
      trigger: { label: "", title: "Borrar", sr: "Borrar recurso" },
      dialog: {
        title: (resourceName: string) =>
          `¿Deseas eliminar el recurso '${resourceName}'?`,
        description:
          "Al eliminar este recurso todo su contenido será eliminado y dejará de estar disponible para todas las personas",
      },
    },
  },
  validations: {
    repeatedName: "Ya existe un recurso de monitoreo con ese nombre",
    fileSize: (sizeInMb: number) =>
      `El archivo excede el tamaño máximo permitido (${sizeInMb}MB).`,
    checkUrl: "Revisa que la url esté activa",
  },
  title: (isUpdate: boolean) =>
    isUpdate ? "Actualizar recurso" : "Crear recurso",
  name: {
    label: "Nombre del recurso",
    placeholder: "Cómo medir el tronco de la palma",
  },
  initiative: {
    one: "Recurso bajo la iniciativa ",
    many: "Selecciona la iniciativa con la que se relaciona el recurso",
  },
  desctiption: {
    label: "Descripción",
    placeholder: "Descricion del recurso",
  },
  attachments: {
    ui: {
      view: { label: "", title: "Ver", sr: "Ver adjunto" },
      edit: { label: "", title: "Editar", sr: "Editar adjunto" },
      del: { label: "", title: "Borrar", sr: "Borrar adjunto" },
      fileUpload: {
        label: "Cargar archivo",
        placeholder: "Buscar el archivo...",
      },
      save: {
        title: (isUpdate: boolean) => (isUpdate ? "Guardar" : "Agregar"),
        label: (isUpdate: boolean) => (isUpdate ? "" : ""),
        sr: (isUpdate: boolean) =>
          isUpdate ? "Guardar cambios" : "Agregar adjunto",
      },
      cancel: { title: "Cancelar", label: "Cancelar edición", sr: "" },
    },
    links: {
      module: {
        title: "Adjuntar enlaces al recurso",
        attachmentsListTitle: "Enlaces adjuntos",
        attachmentTypes: "¿El enlace hacia qué tipo de recurso apunta?",
      },
      description: {
        label: "Descripción del enlace",
        placeholder: "Los modelos de distribución...",
      },
      resource: { label: "Enlace", placeholder: "https://ejemplo.com" },
    },
    files: {
      module: {
        title: "Adjuntar archivos al recurso",
        attachmentsListTitle: "Archivos adjuntos",
        attachmentTypes: "¿Qué formato de archivo deseas adjuntar?",
      },
      description: {
        label: "Descripcion",
        placeholder: "palo palo palo",
      },
      resource: { label: "archivo" },
    },
  },
  isDraft: {
    label: "¿Publicar el recurso?",
    feedback: (isDraft: boolean) =>
      isDraft ? "No, aún es borrador" : "Si, es público",
  },
  confirmationToast: {
    title: (isUpdate: boolean) =>
      isUpdate ? "Recurso guardado" : "Recurso creado",
    description: (isUpdate: boolean, resourceName: string) =>
      `El recurso de monitoreo '${resourceName}' fue ${isUpdate ? "guardado" : "creado"} exitosamente`,
    actionButton: "ver recurso",
  },
};
