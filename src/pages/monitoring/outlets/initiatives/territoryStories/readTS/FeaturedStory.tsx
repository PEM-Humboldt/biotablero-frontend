import { useParams } from "react-router";
import { useEffect, useState } from "react";

import { parseSimpleMarkdown } from "@utils/textParser";
import { ErrorsList } from "@ui/LabelingWithErrors";

import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";
import { getTerritoryStoriesFromInitiative } from "pages/monitoring/api/services/territoryStory";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { getFeaturedImage } from "pages/monitoring/outlets/initiatives/territoryStories/utils/getFeaturedImage";
import { StoryCreationInfo } from "pages/monitoring/outlets/initiatives/territoryStories/ui/StoryCreationInfo";
import { StoryCardActions } from "pages/monitoring/outlets/initiatives/territoryStories/ui/StoryCardActions";

export function FeaturedStory() {
  const { initiativeId } = useParams();
  const [featuredStory, setFeaturedStory] =
    useState<TerritoryStoryShort | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!initiativeId) {
      return;
    }

    const getFeaturedStory = async () => {
      setIsLoading(true);
      const res = await getTerritoryStoriesFromInitiative(Number(initiativeId))(
        { filter: "featuredContent eq true and enabled eq true" },
      );

      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      const story = res["@odata.count"] === 1 ? res.value[0] : null;
      setFeaturedStory(story);

      if (!story) {
        return;
      }
    };

    void getFeaturedStory();
  }, [initiativeId]);

  if (featuredStory === null) {
    return null;
  }

  const featuredImg = getFeaturedImage(featuredStory);

  return !featuredStory || isLoading ? null : (
    <>
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent rounded-lg m-4 p-4"
      />

      <article className="m-4 p-4 pb-2 rounded-xl shadow-lg space-y-4 bg-background outline outline-primary/10 hover:outline-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
        <header>
          <h3 className="text-primary text-3xl font-normal">
            <span className="sr-only">Relato destacado:</span>
            {featuredStory?.title}
          </h3>
          <img
            src={featuredImg.url}
            alt={featuredImg.alt}
            className="aspect-video lg:aspect-auto lg:max-h-[300px] lg:w-full object-cover object-center rounded"
          />
        </header>

        <div className="line-clamp-2">
          {parseSimpleMarkdown(featuredStory.text, { plain: true })}
        </div>

        <footer className="space-y-4 mt-2">
          <StoryCreationInfo story={featuredStory} />
          <StoryCardActions story={featuredStory} className="-ml-2 -mr-3" />
        </footer>
      </article>
    </>
  );
}
