import { Link, useParams } from "react-router";

import { TablePager } from "@composites/TablePager";
import { TERRITORY_STORIES_PER_PAGE } from "@config/monitoring";

import type { PanelComponentProp } from "pages/monitoring/outlets/initiatives/types/territoryStory";
import { FeaturedStory } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/FeaturedStory";
import { TerritoryStoriesList } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/TerritoryStoriesList";
import { TerritoryStoryReader } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/TerritoryStoryReader";
import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { TSSearchBar } from "pages/monitoring/outlets/initiatives/territoryStories/TSSearchBar";

export function ReadTS({ moveToPanel: _ }: PanelComponentProp) {
  const { storysAmount, currentPage, setCurrentPage, isLoading, errors } =
    useTerritoryStorysCTX();
  const { initiativeId, detailItem } = useParams();
  const baseUrl = `/Monitoreo/Iniciativas/${initiativeId}/Relatos/`;

  return detailItem ? (
    <TerritoryStoryReader />
  ) : (
    <>
      <FeaturedStory />
      <TSSearchBar className="p-4 pt-2 " />
      <TerritoryStoriesList />
      <TablePager
        currentPage={currentPage}
        recordsAvailable={storysAmount}
        onPageChange={setCurrentPage}
        recordsPerPage={TERRITORY_STORIES_PER_PAGE}
        paginated={3}
        className="mt-4 mb-8"
      />
    </>
  );
}
