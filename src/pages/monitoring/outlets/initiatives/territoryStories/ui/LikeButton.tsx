import type { TerritoryStoryFull } from "pages/monitoring/types/territoryStory";
import { likedTerritoryStory } from "pages/monitoring/api/services/territoryStory";
import { useTerritoryStoriesCTX } from "pages/monitoring/hooks/useTerritoryStoriesCTX";
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
  const { updateCurrentStory } = useTerritoryStoriesCTX();

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
