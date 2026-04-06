import { Link, useParams } from "react-router";
import { CirclePlus } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";

import { LikeButton } from "pages/monitoring/outlets/initiatives/territoryStories/ui/LikeButton";
import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";
import { cn } from "@ui/shadCN/lib/utils";

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
    <div className={cn("flex justify-between gap-2", className)}>
      <LikeButton story={story} disabled />
      <Button variant="ghost-clean" asChild>
        <Link to={`${baseUrl}${story.id}`}>
          Leer <span className="sr-only">el relato</span>
          <CirclePlus className="size-6" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}
