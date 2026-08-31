import { LOCALE } from "@config/monitoring";
import { cn } from "@ui/shadCN/lib/utils";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";

import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";

export function StoryCreationCardInfo({
  story,
  className,
}: {
  story: TerritoryStoryShort;
  className?: string;
}) {
  return (
    <div className={className}>
      <StoryTimestamp
        story={story}
        className="text-grey-dark/60 font-normal text-sm"
      />
      <StoryCreator
        story={story}
        className="mt-2 text-lg text-grey-dark/80 font-normal"
      />
    </div>
  );
}

export function StoryTimestamp({
  story,
  className,
}: {
  story: TerritoryStoryShort;
  className?: string;
}) {
  const creationDate = new Date(story.creationDate);

  return (
    <time className={className} dateTime={creationDate.toLocaleDateString()}>
      {creationDate.toLocaleDateString(LOCALE, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </time>
  );
}

// TODO: Cuando esté disponible la actualización del endpoint, hay que agregar la imagen de quien escribió esto
export function StoryCreator({
  story,
  className,
}: {
  story: TerritoryStoryShort;
  className?: string;
}) {
  return (
    <div
      title={`Escrito por ${story.authorUserName}`}
      className={cn("flex gap-2 items-center", className)}
    >
      {story.authorUserName}
    </div>
  );
}
