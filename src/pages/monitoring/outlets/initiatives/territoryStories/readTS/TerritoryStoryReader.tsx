import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { useNavigate, useParams } from "react-router";
import { Button } from "@ui/shadCN/component/button";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { parseSimpleMarkdown } from "@utils/textParser";
import { getFeaturedImage } from "pages/monitoring/outlets/initiatives/territoryStories/utils/getFeaturedImage";
import { InitiativeError } from "pages/monitoring/outlets/initiatives/InitiativeError";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  CircleArrowLeft,
  GalleryThumbnails,
} from "lucide-react";
import { TERRITORY_STORY_HEADINGS_OFFSET } from "@config/monitoring";
import { LikeButton } from "pages/monitoring/outlets/initiatives/territoryStories/ui/LikeButton";
import { MediaGallery } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/territoryStoryReader/MediaGallery";
import { StoryCreator, StoryTimestamp } from "../ui/StoryCreationInfo";

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
    <div className="flex flex-col p-4 gap-4">
      <Button
        variant="outline"
        size="lg"
        onClick={() => void navigate(baseUrl)}
        className="self-end"
        title="Volver al explorador"
      >
        Volver a los relatos del territorio
        <CircleArrowLeft />
      </Button>

      <article>
        <header className="flex flex-col">
          <figure className="flex flex-col items-end mb-4">
            <img
              src={featuredImg.url}
              alt={featuredImg.alt}
              className="w-full outline outline-primary/20"
            />
            <figcaption className="text-right p-4 pt-1 w-[50%] min-w-[250px] text-balance">
              {featuredImg.alt}
            </figcaption>
          </figure>

          <div className="flex flex-col-reverse">
            <h3 className="text-3xl font-bold mb-1">{currentStory.title}</h3>

            <div className="grid grid-cols-2 items-center">
              <StoryTimestamp
                story={currentStory}
                className="text-muted-foreground text-sm"
              />
              <StoryCreator
                story={currentStory}
                className="text-lg font-normal"
              />
            </div>
          </div>

          {currentStory.keywords && (
            <ul className="flex flex-wrap gap-2 -ml-2 list-none">
              {currentStory.keywords.split(",").map((kw, index) => (
                <li
                  key={`${currentStory.id}-kw-${index}`}
                  className="px-2 pb-0.5 bg-muted text-sm text-primary font-normal border border-input text-xs rounded-full"
                >
                  {kw.trim()}
                </li>
              ))}
            </ul>
          )}

          <LikeButton story={currentStory} className="-ml-2 mt-4 mb-6" />
        </header>

        <section className="markdown-renderer mb-8 w-full max-w-[75ch]">
          {parseSimpleMarkdown(currentStory.text, {
            headingsOffset: TERRITORY_STORY_HEADINGS_OFFSET,
          })}
        </section>

        <MediaGallery story={currentStory} />

        <footer className="mt-4 pt-4 pb-8 px-4 border-t border-t-input flex gap-2 justify-center">
          {prevStory && (
            <Button
              variant="ghost"
              size="lg"
              onClick={() => void navigate(`${baseUrl}${prevStory.id}`)}
              className="mb-6"
              title="Leer el relato anterior"
            >
              <ArrowLeftFromLine aria-hidden="true" />
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
              <ArrowRightFromLine aria-hidden="true" />
            </Button>
          )}
        </footer>
      </article>
    </div>
  );
}
