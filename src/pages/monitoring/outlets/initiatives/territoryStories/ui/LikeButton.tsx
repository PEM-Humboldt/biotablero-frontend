import type { TerritoryStoryFull } from "pages/monitoring/types/territoryStory";
import { likedTerritoryStory } from "pages/monitoring/api/services/territoryStory";
import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { LikeButton } from "pages/monitoring/ui/LikeButton";

export function LikeTSButton({
  story,
  disabled,
  className,
}: {
  story: TerritoryStoryFull;
  disabled?: boolean;
  className?: string;
}) {
  const { updateCurrentStory } = useTerritoryStorysCTX();

  return (
    <LikeButton
      source={story}
      likeHandler={likedTerritoryStory}
      disabled={disabled}
      className={className}
      updater={updateCurrentStory}
    />
  );
}
