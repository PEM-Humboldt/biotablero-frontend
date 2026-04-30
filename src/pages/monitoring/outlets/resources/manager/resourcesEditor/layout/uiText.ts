// import { uiText } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/uiText";

export const uiText = {
  validations: {
    repeatedName: "Ya existe un recurso de monitoreo con ese nombre",
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
