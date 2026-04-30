import {
  RESOURCE_MAX_FILES_AMOUNT,
  RESOURCE_MAX_LINKS_AMOUNT,
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
    max: RESOURCE_MAX_LINKS_AMOUNT,
    helpers: helperKeys.links,
  },
  {
    id: "files",
    type: "file",
    max: RESOURCE_MAX_FILES_AMOUNT,
    helpers: helperKeys.files,
  },
] as const;
