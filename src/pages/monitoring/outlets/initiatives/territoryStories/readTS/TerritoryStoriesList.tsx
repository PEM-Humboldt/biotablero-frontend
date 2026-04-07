import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { useMemo } from "react";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { getFeaturedImage } from "pages/monitoring/outlets/initiatives/territoryStories/utils/getFeaturedImage";
import { StoryCreationCardInfo } from "pages/monitoring/outlets/initiatives/territoryStories/ui/StoryCreationInfo";
import { StoryCardActions } from "pages/monitoring/outlets/initiatives/territoryStories/ui/StoryCardActions";

export function TerritoryStoriesList() {
  const { stories, errors, isLoading } = useTerritoryStorysCTX();
  const { userStateInInitiative } = useInitiativeCTX();

  const userHasAccess = [
    UserStateInInitiative.USER_LEADER,
    UserStateInInitiative.USER_PARTICIPANT,
    UserStateInInitiative.USER_VIEWER,
  ].includes(userStateInInitiative);

  const renderStories = useMemo(() => {
    return stories.filter(
      (story) => !story.featuredContent && (userHasAccess || !story.restricted),
    );
  }, [userHasAccess, stories]);

  return isLoading ? (
    <div className="p-8 m-16 mt-4 bg-muted border border-primary/50 rounded-lg text-3xl text-primary text-center">
      Cargando...
    </div>
  ) : (
    <>
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent rounded-lg m-4 mt-0 p-4"
      />

      {stories.length === 0 ? (
        <div className="p-8 m-16 mt-4 bg-muted border border-primary/50 rounded-lg text-3xl text-primary text-center">
          No se encontraron relatos que conincidan con tu búsqueda
        </div>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 p-8 pb-16 pt-4">
          {renderStories.map((story) => {
            const featuredImg = getFeaturedImage(story);

            return (
              <li key={story.id}>
                <article className="rounded-xl bg-background overflow-hidden flex flex-col gap-4 h-full justify-between pb-2 outline outline-primary/31 hover:outline-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
                  <header>
                    <img
                      src={featuredImg.url}
                      alt={featuredImg.alt}
                      className="aspect-3/2  lg:max-h-[400px] object-cover object-center"
                    />
                    <h3 className="py-2 px-4 text-lg font-normal m-0">
                      {story.title}
                    </h3>

                    {story.keywords !== undefined && (
                      <ul className="flex flex-wrap gap-2 px-4 list-none">
                        {story.keywords.split(",").map((kw, index) => (
                          <li
                            key={`${story.id}-kw-${index}`}
                            className="flex px-2 items-start bg-muted text-primary text-sm rounded"
                          >
                            {kw}
                          </li>
                        ))}
                      </ul>
                    )}
                  </header>

                  <footer className="px-4 justify-self-end">
                    <StoryCreationCardInfo story={story} className="mb-4" />

                    <StoryCardActions
                      story={story}
                      className="flex -mx-4 justify-between content-end items-center"
                    />
                  </footer>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
