import {
  RESOURCE_ATTACHMENT_DESCRIPTION_MAX_LENGTH,
  RESOURCE_FILES_MAX_AMOUNT,
  RESOURCE_LINK_MAX_LENGTH,
  RESOURCE_LINKS_MAX_AMOUNT,
} from "@config/monitoring";
import { helperInfo } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/helperInfo";

const helperKeys = Object.entries(helperInfo).reduce<{
  files: string[];
  links: string[];
}>(
  (all, [key, value]) => {
    all[value.type].push(key);
    return all;
  },
  { files: [], links: [] },
);

export const attachmentConfigs = [
  {
    id: "links",
    type: "text",
    max: RESOURCE_LINKS_MAX_AMOUNT,
    helpers: helperKeys.links,
    linkMaxLength: RESOURCE_LINK_MAX_LENGTH,
    descriptionMaxLength: RESOURCE_ATTACHMENT_DESCRIPTION_MAX_LENGTH,
  },
  {
    id: "files",
    type: "file",
    max: RESOURCE_FILES_MAX_AMOUNT,
    helpers: helperKeys.files,
    linkMaxLength: undefined,
    descriptionMaxLength: RESOURCE_ATTACHMENT_DESCRIPTION_MAX_LENGTH,
  },
] as const;
