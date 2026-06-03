import { RoleInInitiative } from "pages/monitoring/types/catalog";

export const sectionsInfo: Partial<
  Record<
    RoleInInitiative,
    {
      texts: {
        title: { sr: string; label: string };
        counterText: (value: number) => string;
      };
      showInitiativePicture: boolean;
      actions: { editRole: boolean; leaveInitiative: boolean };
    }
  >
> = {
  [RoleInInitiative.LEADER]: {
    texts: {
      title: { sr: "Iniciativas que lidero", label: "Lider" },
      counterText: (value: number) => `Lidero en ${value} iniciativas`,
    },
    showInitiativePicture: true,
    actions: { editRole: true, leaveInitiative: false },
  },
  [RoleInInitiative.USER]: {
    texts: {
      title: { sr: "Iniciativas en las que colaboro", label: "Colaborador" },
      counterText: (value: number) => `Colaboro en ${value} iniciativas`,
    },
    showInitiativePicture: true,
    actions: { editRole: true, leaveInitiative: true },
  },
  [RoleInInitiative.VIEWER]: {
    texts: {
      title: { sr: "Iniciativas que observo", label: "Observador" },
      counterText: (value: number) => `Observo ${value} iniciativas`,
    },
    showInitiativePicture: false,
    actions: { editRole: false, leaveInitiative: true },
  },
};
