import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";
import { useEffect, useState } from "react";
import { StoryTimestamp } from "pages/monitoring/outlets/initiatives/territoryStories/ui/StoryCreationInfo";
import { Link, useParams } from "react-router";
import { CirclePlus } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { getTerritoryStoriesFromInitiative } from "pages/monitoring/api/services/territoryStory";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { getFeaturedImage } from "pages/monitoring/outlets/initiatives/territoryStories/utils/getFeaturedImage";
import { TERRITORY_STORIES_FROM_OTHER_INITIATIVE } from "@config/monitoring";

import monitoringResources from "core/assets/MonitoringResources.jpg";
import monitoringResourcesBg from "core/assets/MonitoringResourcesBG.jpg";

export function TSAside() {
  return (
    <aside className="py-8 px-4 xl:px-8">
      <div className="sticky top-8 space-y-8">
        <TSRecomendations />
        <OtherMonitoringResources />
      </div>
    </aside>
  );
}

function TSRecomendations() {
  const { initiativeId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [randomStorys, setRandomStorys] = useState<TerritoryStoryShort[]>([]);
  const baseUrl = `/Monitoreo/Iniciativas/${initiativeId}/Relatos/`;

  useEffect(() => {
    // TODO: Script temporal mientras se definen los parámetros para
    // halar las 3 historias random de otras iniciativas
    const fetchStories = async () => {
      setIsLoading(true);
      if (!initiativeId) {
        return;
      }
      const storys = await getTerritoryStoriesFromInitiative(
        Number(initiativeId),
      )({});
      if (isMonitoringAPIError(storys)) {
        setRandomStorys([]);
        setErrors(storys.data.map((err) => err.msg));
        setIsLoading(false);
        return;
      }

      const totalStorys = storys.value;
      const rndStorys: TerritoryStoryShort[] = [];
      while (
        rndStorys.length < TERRITORY_STORIES_FROM_OTHER_INITIATIVE &&
        totalStorys.length > 0
      ) {
        const randomStoryIndx = Math.floor(Math.random() * totalStorys.length);
        rndStorys.push(...totalStorys.splice(randomStoryIndx, 1));
      }

      setRandomStorys(rndStorys);
      setIsLoading(false);
    };

    void fetchStories();
  }, [initiativeId]);

  return isLoading ? (
    <div>cagandooooo</div>
  ) : (
    <div className="flex flex-col gap-2">
      <h3 className="text-primary text-lg font-normal m-0">Otros relatos</h3>
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent rounded-lg p-4"
      />
      {randomStorys.map((story) => {
        const featuredImg = getFeaturedImage(story);
        return (
          <article
            key={story.id}
            className="border-b border-b-grey last:border-none flex gap-2 pt-2 pb-4"
          >
            <img
              src={featuredImg.url}
              alt={featuredImg.alt}
              className="h-25 w-20 rounded object-cover"
            />
            <div className="w-full flex flex-col justify-between">
              <h4>{story.title}</h4>
              <div className="w-full flex justify-between items-center">
                <StoryTimestamp
                  story={story}
                  className="text-sm text-primary"
                />

                <Button variant="ghost-clean" asChild>
                  <Link to={`${baseUrl}${story.id}`}>
                    Leer <span className="sr-only">el relato</span>
                    <CirclePlus className="size-6" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function OtherMonitoringResources() {
  return (
    <div className="shadow-2xl rounded-3xl overflow-hidden">
      <img
        src={monitoringResources}
        alt="Personas realizando monitoreo comunitario"
        className="aspect-video object-cover object-top "
      />
      <div
        className="flex flex-col bg-primary p-4 bg-cover bg-center bg-no-repeat bg-blend-multiply overflow-hidden text-background"
        style={{
          backgroundImage: `url(${monitoringResourcesBg})`,
        }}
      >
        <h3>
          ¿Cómo debe nuestra iniciativa tomar los datos sobre biodiversidad?
        </h3>
        <p className="text-lg font-normal">
          Te invitamos a acercarte, participar y aprender cómo podemos, juntos,
          recolectar información sobre la biodiversidad de nuestro territorio.
        </p>

        <Button
          asChild
          variant="link"
          className="self-end flex gap-2 items-center text-right text-background font-normal"
        >
          <Link to="/Monitoreo">
            Accede a los recursos de monitoreo
            <CirclePlus className="size-6" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
