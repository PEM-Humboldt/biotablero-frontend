import type { MonitoringResource } from "pages/monitoring/types/odataResponse";
import { LikeButton } from "pages/monitoring/ui/LikeButton";
import { likedResource } from "pages/monitoring/api/services/monitoringResources";

export function LikeResourceButton({
  resource,
  disabled,
  className,
  updateResorce,
}: {
  resource: MonitoringResource;
  disabled?: boolean;
  className?: string;
  updateResorce?: () => Promise<void>;
}) {
  return (
    <LikeButton
      source={resource}
      likeHandler={likedResource}
      disabled={disabled}
      className={className}
      updater={updateResorce}
    />
  );
}
