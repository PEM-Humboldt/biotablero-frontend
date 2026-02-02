export const uiText = {
  loading: "Cargando...",
  wait: "Espera...",
  save: "Guardar",
  undo: "Deshacer cambios",
  cancel: "Cancelar",
  confirm: "Sí",

  restartForm: "Reiniciar el formulario",
  error: {
    noUpdateData: "No se pudo actualizar la información, intente más tarde.",
    actionError:
      "Ocurrió un problema al realizar la acción, vuelve a cargarla página.",
    noGetData:
      "No es posible obtener los detalles de la iniciativa, intenta de nuevo más tarde",
  },

  criticalError: {
    user: "Error interno de la app",
    log: "Critical error:",
  },

  initiative: {
    createNew: "Crear iniciativa",
    creatingNew: "Creando iniciativa...",
    cancelCreation: "Cancelar creación de una nueva iniciativa",
    noInitiatives: "No hay iniciativas.",
    disabled: "Inactiva",
    enabled: "Activa",
    unasignedFallback: "Sin asignar",

    accordionResume: {
      disabledPresentation: ", Iniciativa inactiva",
      locationPresentation: "Iniciativa ubicada en:",
    },

    displayTables: {
      actionsColTitle: "Acciones",
      nullValuePlaceholder: "---",
      actions: {
        edit: "Editar",
        remove: "Quitar",
      },
    },

    editMode: {
      start: "Editar",
      end: "Terminar edición",
    },

    listManager: {
      tableTitle: "Información lista para guardar",
      actionButtons: {
        save: "Añadir",
        update: "Guardar cambios",
        undo: "Restablecer",
        discard: "Desechar",
      },
      validation: {
        minAmount: (
          amount: number,
        ) => `Siempre deben haber al menos ${amount} elemento
            ${amount > 1 && "s"}.
		 `,
      },
    },

    module: {
      status: {
        disable: "Desactivar iniciativa",
        enable: "Activar iniciativa",
        confirmation: {
          question: "¿realmente quieres hacerlo?",
          enable: "Vas a desactivar la iniciativa",
          disable: "Vas a reactivar la iniciativa",
        },
        disclaimer: {
          enable:
            "Al desactivarla, la información de esta iniciativa dejará de ser pública. Se perderá el permiso de acceso y edición para quienes tengan perfiles de usuario, participante o administrador.",
          disable:
            "Al reactivarla, la información de esta iniciativa volverá a ser pública. Las personas que tengan perfil de usuario, participante o administrador de esta iniciativa, volverán a tener permiso de acceso y edición.",
        },
      },

      general: {
        title: "Información general",
        validation: { uniqueName: "Este nombre de iniciativa ya existe" },

        field: {
          name: "Nombre completo",
          namePlaceholder: "Juntos por la Amazonía",
          shortName: "Nombre corto",
          shortNamePlaceholder: "JPLA",
          description: "¿Quienes somos?",
          descriptionHelper: "Descripción de la iniciativa",
          descriptionPlaceholder: "Esta iniciativa busca...",
          influenceArea: "¿Dónde estamos?",
          influenceAreaHelper: "Contexto territorial y área de influencia",
          influenceAreaPlaceholder:
            "El área de influencia de esta iniciativa es...",
          objective: "¿Cuál es el objetivo?",
          objectiveHelper: "Objetivos y enfoque de la iniciativa",
          objectivePlaceholder: "El objetivo de esta iniciativa es...",
        },
      },

      locations: {
        title: "Ubicación de la iniciativa",
        tableCol: ["Departamento", "Municipio", "Vereda"],
        validation: {
          atLeastOneDepartment: "se debe seleccionar al menos un departamento",
          alreadyExist: "Ya existe esa ubicación",
        },

        field: {
          dept: {
            label: "Selecciona un departamento",
            notFound: "Departamento no encontrado",
            trigger: "Selecciona un departamento",
            placeholder: "buscar departamento",
          },
          muni: {
            label: "Selecciona un municipio",
            notFound: "Municipio no encontrado",
            trigger: "Selecciona un municipio",
            placeholder: "buscar municipio",
          },
          local: {
            label: "Escribe el nombre de la vereda",
            placeholder: "Nombre de la vereda",
          },
        },
      },

      contacts: {
        title: "Información de contacto",
        tableCol: ["Correo", "Teléfono"],

        field: {
          mail: "Correo",
          mailPlaceholder: "mi_iniciativa@dominio.com",
          phone: "Teléfono",
          phonePlaceholder: "3046669666",
        },
      },

      users: {
        title: "líderezas y líderes de la iniciativa",
        tableCol: ["Nombre"],

        field: {
          username: {
            label: "Selecciona un lider o lidereza",
            notFound: "Usuario no encontrado",
            trigger: "Selecciona un usuario ",
            placeholder: "buscar lider",
          },
        },
      },

      images: {
        title: "Imágenes",
        imageUrl: {
          title: "Imagen de la iniciativa",
          alt: "Vista previa de la imagen de la iniciativa",
        },
        bannerUrl: {
          title: "Banner para la iniciativa",
          alt: "Vista previa del banner para la iniciativa",
        },

        userAction: {
          upload: "Clic para cargar una imagen",
          uploadAgain: "Cargar de nuevo",
          removeImage: "Borrar imágen",
        },
      },
    },
  },
};
