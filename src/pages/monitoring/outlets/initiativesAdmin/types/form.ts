import type { InitiativeDataForm } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

export type FormClientValidation = {
  condition: (data: InitiativeDataForm) => boolean;
  message: string;
  path: string;
};
