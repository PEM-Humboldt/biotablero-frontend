export const uiText = {
  title: "Administrador de etiquetas",
  noDataAvailable: "No hay registros disponibles",
  loading: "Cargando...",
  wait: "Espera...",
  save: "Guardar",
  undo: "Deshacer cambios",
  cancel: "Cancelar",
  confirm: "Sí",
  successCreate: "¡Etiqueta creada con éxito!",
  successEdit: "¡Etiqueta editada con éxito!",

  restartForm: "Reiniciar el formulario",
  error: {
    noUpdateData: "No se pudo actualizar la información, intente más tarde.",
    actionError:
      "Ocurrió un problema al realizar la acción, vuelve a cargarla página.",
  },

  criticalError: {
    user: "Error interno de la app",
    log: "Critical error:",
  },

  loadingStates: {
    loaded: null,
    loading: "Cargando registros...",
    error: "No fue posible cargar los registros, intenta más tarde.",
  },

  tag: {
    createTitle: "Nueva etiqueta",
    create: "Crear etiqueta",
    creating: "Creando etiqueta...",
    createOrUpdateDescription: "Ingresa la nueva información",
    editTitle: "Editar etiqueta",
    update: "Actualizar etiqueta",
    updating: "Actualizando...",
  },

  form: {
    selectCategoryLabel: "Seleccione la categoría",
    defaultCategoryTitle: "-- Elige una categoría --",
    category: "Categoría",
    nameLabel:
      "Nombre corto para la etiqueta (en caso de tener una abreviación usar acá)",
    fullNameLabel:
      "Nombre completo de la etiqueta (usar sólo si se usó el nombre corto)",
    urlLabel: "URL de la etiqueta",

    validation: {
      categoryIdRequired: "Se requiere seleccionar una categoría",
      nameRequired: "La etiqueta requiere un nombre",
      invalidUrl: "URL inválida",
    },

    placeholders: {
      tagName: "Nombre de la etiqueta o la abreviación",
      tagUrl: "https://ejemplo.co",
      tagLongName:
        "Un nombre muy largo para la etiqueta, suele ser el nombre de una organizacion",
    },
  },

  toast: {
    create: {
      title: "Proceso exitoso",
      description: `Se ha creado una etiqueta`,
    },
    edit: {
      title: "Proceso exitoso",
      description: `Se ha editado una etiqueta`,
    },
    delete: {
      title: "Proceso exitoso",
      description: `Se ha eliminado una etiqueta`,
    },
  },

  table: {
    loadStatus: {
      loaded: null,
      loading: "Cargando...",
      error: "No disponible",
    },
    editBtn: {
      defaultText: "Editar",
    },
    deleteBtn: {
      defaultText: "Eliminar",
      dialog: {
        title: "Eliminar etiqueta",
        description: (name: string) =>
          `¿Estás seguro de eliminar la etiqueta '${name}'?`,
      },
      actionBtns: {
        confirm: "Sí",
        cancel: "No",
      },
    },
  },
};
