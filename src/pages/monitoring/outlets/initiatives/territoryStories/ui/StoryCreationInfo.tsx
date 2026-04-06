import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";

// TODO: Cuando se realice la implementación con el sistema de usuarios
// hay que actualizar el cómo se muestra la data de quien escribió esto
export function StoryCreationInfo({
  story,
  className,
}: {
  story: TerritoryStoryShort;
  className?: string;
}) {
  const creationDate = new Date(story.creationDate);
  return (
    <div className={className}>
      <time
        className="text-grey-dark/60 font-normal text-sm"
        dateTime={creationDate.toLocaleDateString()}
      >
        {creationDate.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </time>

      <div className="mt-2 flex gap-2 items-center text-lg text-grey-dark/80 font-normal">
        <img
          src="https://picsum.photos/200/200"
          alt=""
          className="aspect-square max-h-8 rounded-full"
        />
        {story.authorUserName}
      </div>
    </div>
  );
}
