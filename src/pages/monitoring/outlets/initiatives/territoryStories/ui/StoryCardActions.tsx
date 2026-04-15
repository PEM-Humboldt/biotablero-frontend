import { Link, useParams } from "react-router";
import { CirclePlus } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";

import { LikeButton } from "pages/monitoring/outlets/initiatives/territoryStories/ui/LikeButton";
import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";
import { cn } from "@ui/shadCN/lib/utils";
import { uiText } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/territoryStoryReader/layout/uiText";

export function StoryCardActions({
  story,
  className,
}: {
  story: TerritoryStoryShort;
  className?: string;
}) {
  const { initiativeId } = useParams();
  const baseUrl = `/Monitoreo/Iniciativas/${initiativeId}/Relatos/`;
  return (
    <div className={cn("flex justify-between gap-2 items-center", className)}>
      <LikeButton story={story} disabled />
      <Button variant="ghost-clean" asChild>
        <Link to={`${baseUrl}${story.id}`}>
          <span aria-hidden="true">{uiText.cardActions.btn.label}</span>
          <span className="sr-only">{uiText.cardActions.btn.sr}</span>
          <CirclePlus className="size-6" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}
