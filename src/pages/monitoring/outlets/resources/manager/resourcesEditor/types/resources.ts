import type { TagData } from "pages/monitoring/types/initiative";
import type {
  ResourceAttachment,
  ResourceTag,
} from "pages/monitoring/types/odataResponse";

export type MonirotingResourceForm = {
  initiativeId: number | null;
  name: string;
  description: string;
  isDraft: boolean;
  files: Partial<ResourceAttachment & { file: File }>[];
  links: Partial<ResourceAttachment>[];
  tags: Record<number, (ResourceTag | TagData)[]>;
};
