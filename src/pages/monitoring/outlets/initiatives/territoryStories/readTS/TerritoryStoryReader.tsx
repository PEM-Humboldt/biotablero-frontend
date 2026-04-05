import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { useNavigate, useParams, Link } from "react-router";
import { Button } from "@ui/shadCN/component/button";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { parseSimpleMarkdown } from "@utils/textParser";
import { getFeaturedImage } from "pages/monitoring/outlets/initiatives/territoryStories/utils/getFeaturedImage";
import { InitiativeError } from "pages/monitoring/outlets/initiatives/InitiativeError";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  GalleryThumbnails,
} from "lucide-react";

export function TerritoryStoryReader() {
  const { initiativeId } = useParams();
  const { userStateInInitiative } = useInitiativeCTX();
  const { errors, isLoading, currentStory, prevStory, nextStory } =
    useTerritoryStorysCTX();
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

  if (!currentStory || errors.length > 0 || !userHasAccess) {
    let errorMessage =
      "Algo inesperado ocurrió, vuelve a intentarlo más tarde.";

    if (!currentStory) {
      errorMessage =
        "No pudimos encontrar el relato que buscas o sucedió algo inesperado al cargarlo.";
    } else if (!userHasAccess) {
      errorMessage =
        "No tienes los permisos necesarios para leer este relato. Contacta al líder de la iniciativa.";
    }

    return (
      <InitiativeError
        msg={errorMessage}
        errors={errors}
        goBack={baseUrl}
        className="h-full"
      />
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

        <footer className="mt-4 pt-4 pb-8 px-4 border-t border-t-input flex gap-2 justify-center">
          {prevStory && (
            <Button
              variant="ghost"
              size="lg"
              onClick={() => void navigate(`${baseUrl}${prevStory.id}`)}
              className="mb-6"
              title="Leer el relato anterior"
            >
              <ArrowLeftFromLine className="size-6" aria-hidden="true" />
              <span className="sr-only">Leer el relato anterior:</span>
              {prevStory.title}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon-lg"
            onClick={() => void navigate(baseUrl)}
            className="mb-6"
            title="Volver al explorador"
          >
            <span className="sr-only">Volver al explorador de relatos</span>
            <GalleryThumbnails className="size-6" />
          </Button>

          {nextStory && (
            <Button
              variant="ghost"
              size="lg"
              onClick={() => void navigate(`${baseUrl}${nextStory.id}`)}
              className="mb-6"
              title="Leer el relato siguente"
            >
              <span className="sr-only">Leer el relato siguiente:</span>
              {nextStory.title}
              <ArrowRightFromLine className="size-6" aria-hidden="true" />
            </Button>
          )}
        </footer>
      </article>
    </div>
  );
}
