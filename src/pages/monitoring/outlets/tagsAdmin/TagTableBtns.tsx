import { TagFormButton } from "pages/monitoring/outlets/tagsAdmin/TagFormBtn";
import { TagDeleteButton } from "pages/monitoring/outlets/tagsAdmin/TagDeleteBtn";

export function TagTableButtons({
  value: tagId,
  onActionSuccess,
}: {
  value?: unknown;
  onActionSuccess?: () => void;
}) {
  if (typeof tagId !== "number") {
    throw new Error(
      `Expected type of value: number, received: ${typeof tagId}`,
    );
  }

  return (
    <>
      <TagFormButton value={tagId} onActionSuccess={onActionSuccess} />
      <TagDeleteButton value={tagId} onActionSuccess={onActionSuccess} />
    </>
  );
}
