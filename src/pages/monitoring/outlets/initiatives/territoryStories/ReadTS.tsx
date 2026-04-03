import { Link, useParams } from "react-router";

import type { PanelComponentProp } from "pages/monitoring/outlets/initiatives/types/territoryStory";
import { FeaturedStory } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/FeaturedStory";
import { TerritoryStoriesList } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/TerritoryStoriesList";
import { TerritoryStoryReader } from "./readTS/TerritoryStoryReader";

export function ReadTS({ moveToPanel: _ }: PanelComponentProp) {
  const { initiativeId, detailItem } = useParams();
  const baseUrl = `/Monitoreo/Iniciativas/${initiativeId}/Relatos/`;

  return detailItem ? (
    <TerritoryStoryReader />
  ) : (
    <>
      <FeaturedStory />
      <TerritoryStoriesList />
    </>
  );
}
