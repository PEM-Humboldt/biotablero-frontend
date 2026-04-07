import { cn } from "@ui/shadCN/lib/utils";
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
      {creationDate.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </time>
  );
}

// TODO: Cuando se realice la implementación con el sistema de usuarios
// hay que actualizar el cómo se muestra la data de quien escribió esto
export function StoryCreator({
  story,
  className,
}: {
  story: TerritoryStoryShort;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <img
        src="https://picsum.photos/200/200"
        alt=""
        className="aspect-square max-h-8 rounded-full"
      />
      {story.authorUserName}
    </div>
  );
}
