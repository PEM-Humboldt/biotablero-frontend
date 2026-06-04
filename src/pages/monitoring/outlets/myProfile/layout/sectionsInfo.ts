import { RoleInInitiative } from "pages/monitoring/types/catalog";

const textNumbers: Record<number, string> = {
  1: "una",
  2: "dos",
  3: "tres",
  4: "cuatro",
  5: "cinco",
};

const getPlural = (count: number) => (count === 1 ? "" : "s");

function getAmount(count: number): string {
  return `${textNumbers[count] ?? count} iniciativa${getPlural(count)}`;
}

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
      counterText: (value: number) => `Lidero en ${getAmount(value)}`,
    },
    showInitiativePicture: true,
    actions: { editRole: true, leaveInitiative: false },
  },
  [RoleInInitiative.USER]: {
    texts: {
      title: { sr: "Iniciativas en las que colaboro", label: "Colaborador" },
      counterText: (value: number) => `Colaboro en ${getAmount(value)}`,
    },
    showInitiativePicture: true,
    actions: { editRole: true, leaveInitiative: true },
  },
  [RoleInInitiative.VIEWER]: {
    texts: {
      title: { sr: "Iniciativas que observo", label: "Observador" },
      counterText: (value: number) => `Observo ${getAmount(value)}`,
    },
    showInitiativePicture: false,
    actions: { editRole: false, leaveInitiative: true },
  },
};
