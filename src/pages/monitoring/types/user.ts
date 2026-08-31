import type { HasId } from "@appTypes/odata";
import type { UserLevel } from "pages/monitoring/types/catalog";

export type UserStats = {
  username: string;
  totalInitiatives: number;
  totalTerritoryStories: number;
  totalResources: number;
};

export interface UserInInitiativeBasicInfo extends HasId {
  initiativeId: number;
  userName: string;
  level: UserLevel;
  creationDate: string;
  focusArea: string;
}

interface UserInInitiativeOpenIdInfo {
  id: string;
  email: string;
  username: string;
  fullName: string;
  picture: string;
}

export interface UserInInitiativeCompleteInfo
  extends UserInInitiativeBasicInfo {
  externalData?: Partial<UserInInitiativeOpenIdInfo>;
}
