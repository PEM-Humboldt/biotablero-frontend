import { TagFormButton } from "pages/monitoring/outlets/tagsAdmin/TagFormBtn";
import { TagDeleteButton } from "pages/monitoring/outlets/tagsAdmin/TagDeleteBtn";
import type { TagDataForm } from "pages/monitoring/types/tagData";
import type { ApiRequestError } from "@appTypes/api";

export function TagTableButtons({
  value: tagId,
  onActionSuccess,
  tagActions,
}: {
  value?: unknown;
  onActionSuccess: () => void;
  tagActions: (
    action: "get" | "create" | "edit" | "delete",
  ) => (
    id?: number,
  ) => (tag?: TagDataForm) => Promise<TagDataForm | ApiRequestError>;
}) {
  if (typeof tagId !== "number") {
    throw new Error(
      `Expected type of value: number, received: ${typeof tagId}`,
    );
  }

  if (!tagActions) {
    throw new Error("'tagActions' should be defined");
  }

  return (
    <>
      <TagFormButton
        value={tagId}
        onActionSuccess={onActionSuccess}
        getTagAction={tagActions("get")}
        editTagAction={tagActions("edit")}
      />
      <TagDeleteButton
        value={tagId}
        onActionSuccess={onActionSuccess}
        getTagAction={tagActions("get")}
        deleteTagAction={tagActions("delete")}
      />
    </>
  );
}
