import { TagFormButton } from "pages/monitoring/outlets/tagsAdmin/TagFormBtn";
import { TagDeleteButton } from "pages/monitoring/outlets/tagsAdmin/TagDeleteBtn";
import type { TagDataForm } from "pages/monitoring/types/tagData";
import type { ApiRequestError } from "@appTypes/api";

export function TagTableButtons({
  value: tagId,
  onActionSuccess,
  tagEditAction,
}: {
  value?: unknown;
  onActionSuccess: () => void;
  tagEditAction: (
    id: number,
    tag: TagDataForm,
  ) => Promise<TagDataForm | ApiRequestError>;
}) {
  if (typeof tagId !== "number") {
    throw new Error(
      `Expected type of value: number, received: ${typeof tagId}`,
    );
  }

  return (
    <>
      <TagFormButton
        value={tagId}
        onActionSuccess={onActionSuccess}
        editTagAction={tagEditAction}
      />
      <TagDeleteButton
        value={tagId}
        onActionSuccess={onActionSuccess}
      />
    </>
  );
}
