import { RoleInInitiative } from "pages/monitoring/types/catalog";

export const roleDictionary: Record<RoleInInitiative, string> = {
  [RoleInInitiative.NONE]: "fuera de la iniciativa",
  [RoleInInitiative.VIEWER]: "observador",
  [RoleInInitiative.USER]: "Participante",
  [RoleInInitiative.LEADER]: "lider",
};

export const uiText = {};
