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

  categoryTranslations: {
    PoliticalContext: "Contexto político",
    SocialContext: "Contexto social",
    BiologicalGroup: "Grupo biológico",
    Ecosystem: "Ecosistema",
  },

  tag: {
    createTitle: "Nueva etiqueta",
    create: "Crear etiqueta",
    creating: "Creando etiqueta...",
    editTitle: "Editar etiqueta",
    update: "Actualizar etiqueta",
    updating: "Actualizando...",
  },

  form: {
    selectCategoryLabel: "Seleccione la categoría",
    defaultCategoryTitle: "-- Elige una categoría --",
    category: "Categoría",
    nameLabel: "Nombre de la etiqueta",
    urlLabel: "URL de la etiqueta (opcional)",

    validation: {
      categoryIdRequired: "Se requiere seleccionar una categoría",
      nameRequired: "La etiqueta requiere un nombre",
    },

    placeholders: {
      tagName: "Nombre de la etiqueta",
      tagUrl: "https://ejemplo.co",
    }
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
