import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { Link, useParams } from "react-router";
import type { PanelComponentProp } from "pages/monitoring/outlets/initiatives/types/territoryStory";
import { useState } from "react";
import { FeaturedStory } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/FeaturedStory";

export function ReadTS({ moveToPanel: _ }: PanelComponentProp) {
  const { stories, currentStory } = useTerritoryStorysCTX();
  const { initiativeId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const baseUrl = `/Monitoreo/Iniciativas/${initiativeId}/Relatos/`;

  return (
    <>
      <FeaturedStory />
      <ul className="bg-primary/30">
        {stories.map((story) => (
          <li key={story.id}>
            <Link to={`${baseUrl}${story.id}`}>{story.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
