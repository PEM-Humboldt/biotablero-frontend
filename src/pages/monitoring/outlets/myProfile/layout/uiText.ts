import { Binoculars, BookMarked, MessageSquareText } from "lucide-react";

// import {uiText} from "pages/monitoring/outlets/myProfile/layout/uiText"
export const uiText = {
  title: "Mi perfil",
  myAccountInfo: { sr: "Información de mi cuenta", label: undefined },
  manageInitiative: { sr: "Administración de iniciativas", label: undefined },

  profileCard: {
    fullNameSrTitle: "Nombre completo",
    emailSrTitle: "Correo de contacto",

    genderTitle: "Género",
    ethnic: "Autoreconocimiento étnico",
    organization: "Organización",

    editButton: {
      title: "Editar mi información",
      sr: "Editar mi información",
      label: "Editar",
    },
  },

  profileStats: {
    myContributionsTitleSr: "Mis contribuciones",

    statsUiInfo: {
      totalInitiatives: {
        icon: Binoculars,
        text: "Iniciativas a las que pertenezco",
      },
      totalTerritoryStories: {
        icon: MessageSquareText,
        text: "Relatos del territorio que he escrito",
      },
      totalResources: {
        icon: BookMarked,
        text: "Recursos de monitoreo que he publicado",
      },
    },
  },

  roleInSections: {
    undefinedRoleInInitiative: "No tienes un perfil en esta iniciativa",
    gotoInitiativeBtn: {
      label: undefined,
      sr: "Ir a la iniciativa",
      title: "Ir a la iniciativa",
    },
    cardDescriptionTitle: {
      role: "Mi perfil",
      initiative: "Descripcion de la iniciativa",
    },
    addRoleButton: {
      title: "Crear perfil",
      sr: "Crear perfil",
      label: "Crear perfil",
    },
    updateRoleButton: {
      title: "Actualizar perfil",
      sr: "Actualizar perfil",
      label: "Actualizar perfil",
    },
  },

  updateFocusAreaForm: {
    toast: {
      title: "Perfil guardado",
      description: (isUpdate: boolean, initiativeName: string) =>
        `Tu perfil en la iniciativa '${initiativeName}' ha sido ${isUpdate ? "actualizado" : "creado"}`,
    },
    textArea: {
      label: "Ingresa tu rol en esta iniciativa",
      placeholder: "Realizo seguimiento...",
    },
    saveBtn: { sr: undefined, title: "Guardar perfil", label: "Guardar" },
    cancelBtn: { sr: undefined, title: "Cancelar", label: "Cancelar" },
  },
};
