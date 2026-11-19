import type { collaboratorsIcons } from "@assets/dictionaries/collaboratorsIcons";

export type Collaborators = keyof typeof collaboratorsIcons;
export interface Names {
  title: string;
  subtitle: string;
}
