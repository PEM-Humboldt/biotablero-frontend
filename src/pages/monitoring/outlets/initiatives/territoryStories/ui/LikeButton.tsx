import { ThumbsUp } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import type { TerritoryStoryFull } from "pages/monitoring/types/territoryStory";
import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";

export function LikeButton({
  story,
}: {
  story: TerritoryStoryFull | TerritoryStoryShort;
}) {
  return (
    <Button variant="ghost">
      <ThumbsUp /> {story.likes}
    </Button>
  );
}
