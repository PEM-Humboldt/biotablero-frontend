import type { InitiativeDataForm } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

export type FormClientValidation = {
  condition: (data: InitiativeDataForm) => boolean;
  message: string;
} & (
  | {
      path: keyof Omit<InitiativeDataForm, "general">;
    }
  | {
      path: "general";
      child: keyof InitiativeDataForm["general"] | "root";
    }
);
