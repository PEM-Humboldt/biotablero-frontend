import { TAG_COLORS } from "@config/monitoring";
import { cn } from "@ui/shadCN/lib/utils";

import type { ODataTag } from "pages/monitoring/types/odataResponse";
import { TagsRender } from "pages/monitoring/ui/TagsRender";
import { translateTagCategory } from "pages/monitoring/outlets/tagsAdmin/utils/tagCategoryTranslator";

export function TagsGroupsRender({
  tags,
  groupId,
  colorIndexOffset = 0,
  stylesFor = { group: "", tags: "" },
}: {
  tags: Omit<ODataTag, "categoryName">[];
  groupId: string;
  colorIndexOffset?: number;
  stylesFor?: { group?: string; tags?: string };
}) {
  const tagsGrouped = tags.reduce<
    Record<number, { group: string; tags: string[] }>
  >((all, tag) => {
    if (!all[tag.category.id]) {
      all[tag.category.id] = {
        group: translateTagCategory(tag.category.name),
        tags: [],
      };
    }
    all[tag.category.id].tags.push(tag.name);

    return all;
  }, {});

  return (
    <div className={cn("flex flex-wrap gap-2", stylesFor.group)}>
      {Object.entries(tagsGrouped).map(([tagGroupId, tags]) => {
        const tagsId = Number(tagGroupId);
        const colorValues =
          TAG_COLORS[(tagsId - colorIndexOffset) % TAG_COLORS.length];
        const colorSet = `${colorValues.bg} ${colorValues.fg}`;

        return (
          <TagsRender
            key={`${groupId}Tags_${tagGroupId}`}
            tags={tags.tags}
            srTitle={tags.group}
            className={cn(colorSet, "font-normal", stylesFor.tags)}
          />
        );
      })}
    </div>
  );
}
