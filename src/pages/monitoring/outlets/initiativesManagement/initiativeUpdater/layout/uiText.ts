import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";

export const roleDictionary: Record<RoleInInitiative, string> = {
  [RoleInInitiative.NONE]: "fuera de la iniciativa",
  [RoleInInitiative.VIEWER]: "observador",
  [RoleInInitiative.USER]: "Participante",
  [RoleInInitiative.LEADER]: "lider",
};

export const userStateInInitiativeDictionary: Record<
  UserStateInInitiative,
  string
> = {
  [UserStateInInitiative.NO_INITIATIVE]: "Iniciativa no seleccionada",
  [UserStateInInitiative.IDLE]: "Cargando...",
  [UserStateInInitiative.GUEST]: "No registrado",
  [UserStateInInitiative.ADMIN]: "Administrador general",
  [UserStateInInitiative.USER_NONE]: "No hace parte de la iniciativa",
  [UserStateInInitiative.USER_LEADER]: "Lider de iniciativa",
  [UserStateInInitiative.USER_PARTICIPANT]: "Participante",
  [UserStateInInitiative.USER_VIEWER]: "Observador",
  [UserStateInInitiative.USER_ASPIRING]: "Solicitante",
};

export const uiText = {
  loading: "Cargando información...",

  error: {
    noGetData:
      "No es posible obtener los detalles de la iniciativa, intenta de nuevo más tarde",
    critical: {
      user: "Error crítico, reinicia la aplicación",
      log: "Critical error:",
    },
  },

  initiativeSelector: {
    itemNotFound: "Iniciativa no encontrada",
    trigger: "Selecciona la iniciativa",
    inputPlaceholder: "carajo",
  },

  tabsLabels: {
    usersManagement: [
      { label: "Gestión de líderes", value: "LEADER" },
      { label: "Gestión de participantes", value: "USER" },
      { label: "Gestión de observadores", value: "VIEWER" },
    ],
    initiativeManagement: { label: "Gestión de la iniciativa" },
  },

  tabsContent: {
    usersManagement: {
      noUsers:
        "Actualmente no hay usuarios dentro de la iniciativa en esta categoría",
      joiningDate: {
        title: "fecha de ingreso a la iniciativa",
        sr: "fecha de ingreso a la iniciativa",
        label: "",
      },
      actions: { notAllowedError: "This role action is not allowed" },

      roleEvents: {
        conditional: {
          minLeaderAmount:
            "Promueva un participante como lider antes de reasignar este Lider",
          maxLeaderAmount: (amount: number) =>
            `No pueden haber más de ${amount} líderes por iniciativa`,
        },

        promote: {
          trigger: (newUserState: string) => ({
            title: `Asignar rol de '${newUserState}'`,
            sr: `Asignar rol de '${newUserState}'`,
            label: "",
          }),

          dialog: (username: string, newUserState: string) => ({
            title: `Vas a asignar a ${username} el rol de '${newUserState}'`,
            description: "Al hacerlo ... ",
          }),

          confirmBtns: {
            confirm: undefined,
            cancel: undefined,
            exit: undefined,
          },
          toast: {
            title: "Usuario promovido",
            description: (username: string, newUserState: string) =>
              `El rol de ${username} ahora es '${newUserState}'.`,
          },
        },

        reasign: {
          trigger: (newUserState: string) => ({
            title: `Asignar rol de '${newUserState}'`,
            sr: `Asignar rol de '${newUserState}'`,
            label: "",
          }),

          dialog: (username: string, newUserState: string) => ({
            title: `Vas a asignar a ${username} el rol de '${newUserState}'`,
            description: "Al hacerlo ... ",
          }),

          confirmBtns: {
            confirm: undefined,
            cancel: undefined,
            exit: undefined,
          },
          toast: {
            title: "Usuario reasignado",
            description: (username: string, newUserState: string) =>
              `El rol de ${username} ahora es '${newUserState}'.`,
          },
        },

        remove: {
          trigger: {
            title: "Retirar de la iniciativa",
            sr: "Retirar de la iniciativa",
            label: "",
          },

          dialog: (username: string, userState: string) => ({
            title: `Vas a retirar al ${userState} ${username} de la iniciativa`,
            description: "Al hacerlo ... ",
          }),

          confirmBtns: {
            confirm: undefined,
            cancel: undefined,
            exit: undefined,
          },

          toast: {
            title: "El usuario ya no hace parte de la iniciativa",
            description: (username: string) =>
              `${username} ya no hace parte de esta iniciativa.`,
          },
        },
      },
    },

    initiativeManagement: {
      general: {
        title: "Información general",
      },

      locations: {
        title: "Ubicación de la iniciativa",
        tableCol: ["Departamento", "Municipio", "Vereda"],
      },

      contacts: {
        title: "Información de contacto",
        tableCol: ["Correo", "Teléfono"],
      },
    },
  },
};
