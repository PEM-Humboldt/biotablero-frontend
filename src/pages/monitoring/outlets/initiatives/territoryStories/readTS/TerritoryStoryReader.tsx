import { useNavigate, useParams } from "react-router";
import {
  CircleArrowLeft,
  CircleArrowRight,
  GalleryThumbnails,
} from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { parseSimpleMarkdown } from "@utils/textParser";
import { TERRITORY_STORY_HEADINGS_OFFSET } from "@config/monitoring";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { getFeaturedImage } from "pages/monitoring/outlets/initiatives/territoryStories/utils/getFeaturedImage";
import { InitiativeError } from "pages/monitoring/outlets/initiatives/InitiativeError";
import { LikeButton } from "pages/monitoring/outlets/initiatives/territoryStories/ui/LikeButton";
import { MediaGallery } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/territoryStoryReader/MediaGallery";
import {
  StoryCreator,
  StoryTimestamp,
} from "pages/monitoring/outlets/initiatives/territoryStories/ui/StoryCreationInfo";
import { uiText } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/territoryStoryReader/layout/uiText";

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
    return <div className="p-8 text-center">{uiText.reader.loading}</div>;
  }

  if (!currentStory || errors.length > 0 || !userHasAccess) {
    let errorMessage = uiText.reader.errors.unknown;

    if (!currentStory) {
      errorMessage = uiText.reader.errors.noStory;
    } else if (!userHasAccess) {
      errorMessage = uiText.reader.errors.unauthorized;
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

  return (
    <div className="flex flex-col p-4 gap-4">
      <Button
        variant="outline"
        size="lg"
        onClick={() => void navigate(baseUrl)}
        className="self-end"
        title={uiText.reader.backToStoryList.title}
      >
        <span className="sr-only">{uiText.reader.backToStoryList.sr}</span>
        <span aria-hidden="true">{uiText.reader.backToStoryList.label}</span>
        <CircleArrowLeft />
      </Button>

      <article>
        <header className="flex flex-col px-4 lg:px-8 pt-2 lg:pt-4">
          <figure className="flex flex-col items-end mb-4">
            <img
              src={featuredImg.url}
              alt={featuredImg.alt}
              className="w-full rounded"
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
                className="text-lg font-normal border-l border-l-primary/30 p-2 px-4"
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
                  {kw}
                </li>
              ))}
            </ul>
          )}

          <LikeButton story={currentStory} className="-ml-2 mt-2 mb-6" />
        </header>

        <section className="markdown-renderer m-4 lg:m-8 mt-0 w-full max-w-[75ch]">
          {parseSimpleMarkdown(currentStory.text, {
            headingsOffset: TERRITORY_STORY_HEADINGS_OFFSET,
          })}
        </section>

        <MediaGallery story={currentStory} />

        <footer className="py-8 px-8 mt-16 border-t border-t-primary/20">
          <ButtonGroup className="flex w-full">
            {prevStory && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => void navigate(`${baseUrl}${prevStory.id}`)}
                className="flex-1"
                title={uiText.reader.prevStoryBtn.title}
              >
                <CircleArrowLeft
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.5}
                />
                <span className="sr-only">{uiText.reader.prevStoryBtn.sr}</span>
                <span className="italic" aria-hidden="true">
                  {uiText.reader.prevStoryBtn.label}
                </span>
                {prevStory.title}
              </Button>
            )}

            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => void navigate(baseUrl)}
              title={uiText.reader.backToStoryList.title}
            >
              <span className="sr-only">
                {uiText.reader.backToStoryList.sr}
              </span>
              <GalleryThumbnails className="size-7" strokeWidth={1.5} />
            </Button>

            {nextStory && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => void navigate(`${baseUrl}${nextStory.id}`)}
                className="flex-1"
                title={uiText.reader.nextStoryBtn.title}
              >
                <span className="sr-only">{uiText.reader.nextStoryBtn.sr}</span>
                <span className="italic" aria-hidden="true">
                  {uiText.reader.nextStoryBtn.label}
                </span>
                {nextStory.title}
                <CircleArrowRight
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.5}
                />
              </Button>
            )}
          </ButtonGroup>
        </footer>
      </article>
    </div>
  );
}
