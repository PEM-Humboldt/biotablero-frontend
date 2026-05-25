import { useParams } from "react-router";

import { TablePager } from "@composites/TablePager";
import { TERRITORY_STORIES_PER_PAGE } from "@config/monitoring";

import type { PanelComponentProp } from "pages/monitoring/outlets/initiatives/types/territoryStory";
import { FeaturedStory } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/FeaturedStory";
import { TerritoryStoriesList } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/TerritoryStoriesList";
import { TerritoryStoryReader } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/TerritoryStoryReader";
import { useTerritoryStoriesCTX } from "pages/monitoring/hooks/useTerritoryStoriesCTX";
import { TSSearchBar } from "pages/monitoring/outlets/initiatives/territoryStories/TSSearchBar";

export function ReadTS({ moveToPanel: _ }: PanelComponentProp) {
  const { storiesAmount, currentPage, setCurrentPage } =
    useTerritoryStoriesCTX();
  const { detailItem } = useParams();

  return detailItem ? (
    <TerritoryStoryReader />
  ) : (
    <>
      <FeaturedStory />
      <TSSearchBar className="p-4 mx-4 pt-2 bg-muted rounded-lg" />
      <TerritoryStoriesList />
      <TablePager
        currentPage={currentPage}
        recordsAvailable={storiesAmount}
        onPageChange={setCurrentPage}
        recordsPerPage={TERRITORY_STORIES_PER_PAGE}
        paginated={3}
        className="mt-4 mb-8"
      />
    </>
  );
}
