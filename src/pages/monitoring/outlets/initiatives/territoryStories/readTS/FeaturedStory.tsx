import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";
import { getTerritoryStoriesFromInitiative } from "pages/monitoring/api/services/territoryStory";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { parseSimpleMarkdown } from "@utils/textParser";
import { CirclePlus, ThumbsUp } from "lucide-react";
import { Button } from "@ui/shadCN/component/button";
import { ErrorsList } from "@ui/LabelingWithErrors";

export function FeaturedStory() {
  const { initiativeId } = useParams();
  const [featuredStory, setFeaturedStory] =
    useState<TerritoryStoryShort | null>(null);
  const [featuredImg, setFeaturedImg] = useState<{
    url: string;
    alt: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const baseUrl = `/Monitoreo/Iniciativas/${initiativeId}/Relatos/`;

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

      const images =
        story?.images && story.images.length > 0 ? story.images : null;

      if (!images) {
        setFeaturedImg({
          url: "https://picsum.photos/1200/800",
          alt: "Imagen random",
        });
        return;
      }

      const featuredImgInfo = images.find((img) => img.featuredContent);
      const randomImageInfo = images[Math.floor(Math.random() * images.length)];

      setFeaturedImg({
        url: featuredImgInfo
          ? featuredImgInfo.fileUrl
          : randomImageInfo.fileUrl,
        alt: featuredImgInfo
          ? featuredImgInfo.description
          : randomImageInfo.description,
      });
    };

    void getFeaturedStory();
  }, [initiativeId]);

  const creationDate = featuredStory
    ? new Date(featuredStory.creationDate)
    : new Date();

  return !featuredStory || isLoading ? null : (
    <>
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent rounded-lg m-4 mt-0 p-4"
      />

      <article className="m-4 mt-0 p-4 rounded-xl shadow-xl space-y-4">
        <header>
          <h3>
            <span className="sr-only">Relato destacado:</span>
            {featuredStory?.title}
          </h3>
          {featuredImg && (
            <img
              src={featuredImg.url}
              alt={featuredImg.alt}
              className="aspect-video lg:aspect-auto lg:max-h-[400px] lg:w-full object-cover object-center rounded-lg"
            />
          )}
        </header>

        <div className="line-clamp-4 max-w-[65ch]">
          {parseSimpleMarkdown(featuredStory.text)}
        </div>

        <footer className="space-y-4">
          <div>
            <time dateTime={creationDate.toLocaleDateString()}>
              {creationDate.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <div>{featuredStory.authorUserName}</div>
          </div>

          <div>
            <Button variant="ghost">
              <ThumbsUp /> {featuredStory.likes}
            </Button>
            <Button variant="ghost" asChild>
              <Link to={`${baseUrl}${featuredStory.id}`}>
                Leer el relato <CirclePlus className="size-6" />
              </Link>
            </Button>
          </div>
        </footer>
      </article>
    </>
  );
}
