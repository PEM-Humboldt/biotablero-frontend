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

export const uiText = {};
