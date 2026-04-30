import type { ResourceAttachment } from "pages/monitoring/types/odataResponse";

export function getAttachmentDiff<
  T extends Partial<ResourceAttachment & { file: File }>,
>(current: T[], original: T[], compareKeys: (keyof T)[]) {
  return {
    add: current.filter((item) => !item.id),
    del: original.filter((old) => !current.some((curr) => curr.id === old.id)),
    edit: current.filter((item) => {
      if (!item.id) {
        return false;
      }
      const ref = original.find((o) => o.id === item.id);
      if (!ref) {
        return false;
      }
      const hasNewFile = !!item.file;
      const hasChanges = compareKeys.some((key) => item[key] !== ref[key]);
      return hasNewFile || hasChanges;
    }),
  };
}
