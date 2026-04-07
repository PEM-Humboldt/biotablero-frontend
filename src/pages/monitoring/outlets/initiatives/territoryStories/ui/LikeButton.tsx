import { ThumbsUp } from "lucide-react";
import { useState } from "react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { cn } from "@ui/shadCN/lib/utils";
import { Button } from "@ui/shadCN/component/button";
import { useUserCTX } from "@hooks/UserContext";

import type { TerritoryStoryFull } from "pages/monitoring/types/territoryStory";
import { likedTerritoryStory } from "pages/monitoring/api/services/territoryStory";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { uiText } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/territoryStoryReader/layout/uiText";

export function LikeButton({
  story,
  disabled,
  className,
}: {
  story: TerritoryStoryFull;
  disabled?: boolean;
  className?: string;
}) {
  const { user } = useUserCTX();
  const [errors, setErrors] = useState<string[]>([]);
  const [iLikeIt, setILikeIt] = useState(!!story.iLikedIt);
  const { updateCurrentStory } = useTerritoryStorysCTX();

  const handleLike = async () => {
    setErrors([]);
    const res = await likedTerritoryStory(story.id);
    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      return;
    }
    setILikeIt(true);
    void updateCurrentStory();
  };

  const isReadOnly = !user || disabled || iLikeIt;

  return isReadOnly ? (
    <div
      className={cn(
        "py-2 px-3 min-h-9 flex gap-2 text-primary font-medium items-center",
        className,
      )}
      title={!user ? uiText.like.noUser : ""}
    >
      <ThumbsUp aria-hidden="true" className="size-5" strokeWidth={2} />
      <span className="text-sm">
        {getLikeStatusMsg(iLikeIt, story.likes, disabled ?? false)}
      </span>
    </div>
  ) : (
    <div className={cn("h-8 flex items-center gap-1", className)}>
      <ErrorsList errorItems={errors} />

      <Button
        variant="ghost"
        onClick={() => void handleLike()}
        title={uiText.like.btn.title}
      >
        <ThumbsUp aria-hidden="true" className="size-5" strokeWidth={2} />
        <span aria-hidden="true">{uiText.like.btn.label}</span>
        <span className="sr-only">{uiText.like.btn.sr}</span>
      </Button>
    </div>
  );
}

function getLikeStatusMsg(iLikeIt: boolean, likes: number, disabled: boolean) {
  if (likes === 0) {
    return uiText.like.first;
  }

  if (iLikeIt && likes === 1) {
    return uiText.like.youLiked;
  }

  const othersCount = iLikeIt ? likes - 1 : likes;

  if (disabled) {
    return uiText.like.btnDisabled(likes);
  }

  if (iLikeIt) {
    return uiText.like.btnIlikedIt(othersCount);
  }

  return uiText.like.btnLegend(othersCount);
}
