import { ThumbsUp } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import type { TerritoryStoryFull } from "pages/monitoring/types/territoryStory";
import { useUserCTX } from "@hooks/UserContext";
import { likedTerritoryStory } from "pages/monitoring/api/services/territoryStory";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useState } from "react";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";

export function LikeButton({
  story,
  disabled,
}: {
  story: TerritoryStoryFull;
  disabled?: boolean;
  updateCallback?: () => void;
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
      className="py-2 px-3 min-h-9 flex gap-2 text-primary font-medium items-center"
      title={!user ? 'Inicia sesión para poder dar "Me gusta"' : ""}
    >
      <ThumbsUp aria-hidden="true" className="size-5" strokeWidth={2} />
      <span className="text-sm">
        {getLikeStatusMsg(iLikeIt, story.likes, disabled ?? false)}
      </span>
    </div>
  ) : (
    <div className="h-8 flex items-center gap-1">
      <ErrorsList errorItems={errors} />

      <Button
        variant="ghost"
        onClick={() => void handleLike()}
        title="Me gusta"
      >
        <ThumbsUp aria-hidden="true" className="size-5" strokeWidth={2} />
        Me gusta
        <span className="sr-only">a este relato.</span>
      </Button>
    </div>
  );
}

function getLikeStatusMsg(iLikeIt: boolean, likes: number, disabled: boolean) {
  if (likes === 0) {
    return 'Da el primer "Me gusta"';
  }

  const textNumbers: Record<number, string> = {
    1: "una",
    2: "dos",
    3: "tres",
    4: "cuatro",
    5: "cinco",
  };

  if (iLikeIt && likes === 1) {
    return "A ti te gusta";
  }

  const othersCount = iLikeIt ? likes - 1 : likes;
  const countStr = textNumbers[othersCount] ?? othersCount;
  const plural = othersCount === 1 ? "" : "s";

  if (disabled) {
    const totalCount = textNumbers[likes] ?? likes;
    const totalPlural = likes === 1 ? "" : "s";
    return `A ${totalCount} persona${totalPlural} le${totalPlural} gusta`;
  }

  if (iLikeIt) {
    return `A ti y a ${countStr} persona${plural} más les gusta este relato`;
  }

  return `A ${countStr} persona${plural} le${plural} gusta este relato`;
}
