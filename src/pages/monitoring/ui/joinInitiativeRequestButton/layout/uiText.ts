import { LogOut, Merge, TicketCheck, TicketX, UserRoundX } from "lucide-react";

export const uiText = {
  loadind: "Cargando...",

  noUser: {
    label: "Unirse a la iniciativa",
    icon: Merge,
  },

  makeJoinRequestToInitiative: {
    dialog: {
      trigger: {
        label: "Unirse a la iniciativa",
        title: undefined,
        sr: undefined,
        icon: TicketCheck,
      },
      dialog: {
        title: (initiativeName: string) =>
          `Estas solicitando unirte a la iniciativa '${initiativeName}'`,
        description:
          "¿Realmente perteneces a este territorio y su trabajo por la biodiversidad?",
      },
      actionBtns: {
        confirm: undefined,
        cancel: undefined,
        exit: undefined,
      },
    },
    toast: {
      title: `Solicitud enviada`,
      description: (initiativeName: string) =>
        `Tu solicitud de ingreso a '${initiativeName}' ha sido enviada, las y los líderes de la iniciativa han sido notificados, pronto estaremos comunicando su respuesta.`,
      icon: TicketCheck,
      durationInSeconds: 4,
    },
  },

  cancelJoinRequestToInitiative: {
    alert: {
      trigger: {
        label: "Cancelar solicitud",
        title: undefined,
        sr: undefined,
        icon: TicketX,
      },
      dialog: {
        title: (initiativeName: string) =>
          `Ya tienes una solicitud pendiente a la iniciativa '${initiativeName}'. ¿Deseas cancelarla? `,
        description:
          "Al hacerlo las y los líderes de la iniciativa no podrán ver tu solicitud ni tu información.",
      },
      actionBtns: {
        confirm: undefined,
        cancel: undefined,
        exit: undefined,
      },
    },
    toast: {
      title: "Solicitud  cancelada",
      description: (initiativeName: string) =>
        `Tu solicitud de ingreso a '${initiativeName}' ha sido cancelada, las y los líderes de la iniciativa no podrán ver tu solicitud ni tu información.`,
      icon: TicketX,
      durationInSeconds: 4,
    },
  },

  leaveInitiative: {
    alert: {
      trigger: {
        label: "Abandonar la iniciativa",
        title: undefined,
        sr: undefined,
        icon: LogOut,
      },
      dialog: {
        title: (initiativeName: string) =>
          `Estás a punto de abandonar la iniciativa '${initiativeName}'`,
        description:
          "Al hacerlo perderás acceso a la información interna de esta iniciativa y dejarás de recibir notificaciones. Si es un error, comunícate con alguno de los administradores",
      },
      actionBtns: {
        confirm: undefined,
        cancel: undefined,
        exit: undefined,
      },
    },
    toast: {
      title: "Iniciativa abandonada",
      description: (initiativeName: string) =>
        `Lamentamos tu partida, a partir de este momento pierdes acceso a la información interna y dejarás de recibir notificaciones de '${initiativeName}'. Si es un error, comunícate con alguno de los administradores`,
      icon: UserRoundX,
      durationInSeconds: 10,
    },
  },
};
