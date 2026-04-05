import { ErrorsList } from "@ui/LabelingWithErrors";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { useNavigate, useParams } from "react-router";
import { Button } from "@ui/shadCN/component/button";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { parseSimpleMarkdown } from "@utils/textParser";
import { getFeaturedImage } from "../utils/getFeaturedImage";
import { InitiativeError } from "pages/monitoring/outlets/initiatives/InitiativeError";

export function TerritoryStoryReader() {
  const { initiativeId } = useParams();
  const { userStateInInitiative } = useInitiativeCTX();
  const { errors, isLoading, currentStory } = useTerritoryStorysCTX();
  const navigate = useNavigate();
  const baseUrl = `/Monitoreo/Iniciativas/${initiativeId}/Relatos/`;

  const userHasAccess =
    [
      UserStateInInitiative.USER_LEADER,
      UserStateInInitiative.USER_PARTICIPANT,
      UserStateInInitiative.USER_VIEWER,
    ].includes(userStateInInitiative) ||
    (currentStory && !currentStory.restricted);

  if (isLoading) {
    return <div className="p-8 text-center">Cargando relato...</div>;
  }
  if (!currentStory || errors.length > 0) {
    return (
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => void navigate(baseUrl)}
          className="mb-4"
        >
          Volver al explorador
        </Button>
        <ErrorsList errorItems={errors} />
        <InitiativeError msg="No pudimos encontrar el relato que buscas o hubo un problema al cargarlo." />
      </div>
    );
  }

  if (!userHasAccess) {
    return (
      <InitiativeError msg="No tienes los permisos necesarios para leer este relato. Contacta al líder de la iniciativa." />
    );
  }

  const featuredImg = getFeaturedImage(currentStory);
  const creationDate = new Date(currentStory.creationDate);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button
        variant="outline"
        onClick={() => void navigate(baseUrl)}
        className="mb-6"
      >
        Volver al explorador de relatos
      </Button>

      <article className="space-y-6">
        <header className="space-y-4">
          <figure className="rounded-xl overflow-hidden shadow-lg">
            <img
              src={featuredImg.url}
              alt={featuredImg.alt}
              className="w-full aspect-video object-cover"
            />
          </figure>

          <h3 className="text-3xl font-bold">{currentStory.title}</h3>

          <div className="flex items-center gap-4 text-muted-foreground">
            <time dateTime={creationDate.toISOString()} className="text-sm">
              {creationDate.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <div className="text-sm font-medium">
              {currentStory.authorUserName}
            </div>
          </div>

          {currentStory.keywords && (
            <ul className="flex flex-wrap gap-2 list-none">
              {currentStory.keywords.split(",").map((kw, index) => (
                <li
                  key={`${currentStory.id}-kw-${index}`}
                  className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                >
                  {kw.trim()}
                </li>
              ))}
            </ul>
          )}
        </header>

        <section className="prose prose-slate max-w-none dark:prose-invert">
          {parseSimpleMarkdown(currentStory.text, { headingsOffset: 2 })}
        </section>

        <section aria-label="Galería de videos" className="empty:hidden">
          {/* Contenido de galería */}
        </section>

        <section aria-label="Galería de imágenes" className="empty:hidden">
          {/* Contenido de galería */}
        </section>

        <footer className="pt-8 border-t">
          <Button variant="outline" className="w-full sm:w-auto">
            Relato anterior
          </Button>

          <Button variant="outline" className="w-full sm:w-auto">
            Siguiente relato
          </Button>
        </footer>
      </article>
    </div>
  );
}
