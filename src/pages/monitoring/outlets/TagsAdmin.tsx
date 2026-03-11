import { useEffect, useRef, useState } from "react";

import { uiText } from "pages/monitoring/outlets/tagsAdmin/layout/uiText";
import type { TagCategory } from "pages/monitoring/types/tagData";
import {
  getTags,
  isMonitoringAPIError,
  monitoringAPI,
} from "pages/monitoring/api/monitoringAPI";
import { LoadStatusMsgBar, LoadStatusMsgBarProp } from "@ui/loadStatusSecction";
import { ODataParams } from "@appTypes/odata";
import { TAG_RECORDS_PER_PAGE } from "@config/monitoring";
import { useLoaderData } from "react-router";
import { ODataTag, ODataTagInfo, TagEntryShort } from "../types/odataResponse";
import { CheckNLoadReturn } from "@appTypes/userLoader";
import { ODataTable } from "@composites/ODataTable";
import { TablePager } from "@composites/TablePager";
import { tableContent } from "./tagsAdmin/layout/tableContent";

type LoadedTags = Awaited<CheckNLoadReturn<null, ODataTagInfo>>;

function parseEntry(rawODataTag: ODataTag): TagEntryShort {
  return {
    ...rawODataTag,
    categoryName: (uiText.categoryTranslations as Record<string, string>)[
              rawODataTag.category.name
            ] || rawODataTag.category.name,
    url: rawODataTag.url || "",
  };
}

function parseODataTags(odataTags: ODataTagInfo): TagEntryShort[] {
  const { value } = odataTags;
  return value.map(parseEntry);
}

export function TagsAdmin() {
  const preloadedTags = useLoaderData<LoadedTags>();
  const [tagCategories, setTagCategories] = useState<TagCategory[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tags, setTags] = useState<ODataTagInfo | null>(
    preloadedTags?.criticalUserData ?? null,
  );
  const [loadMsg, setLoadMsg] = useState<LoadStatusMsgBarProp>({
    message: uiText.loadingStates.loading,
    type: "normal",
  });
  const [searchParams] = useState<ODataParams>({
    top: TAG_RECORDS_PER_PAGE,
    orderby: "category/id asc",
  });
  const prevSearchParamsRef = useRef(searchParams);

  useEffect(() => {
    const fetchTagCategories = async () => {
      const result = await monitoringAPI<TagCategory[]>({
        type: "get",
        endpoint: "TagCategory",
      });

      if (isMonitoringAPIError(result)) {
        throw new Error(result.message);
      }

      setTagCategories(
        result.map((category) => ({
          ...category,
          name:
            (uiText.categoryTranslations as Record<string, string>)[
              category.name
            ] || category.name,
        })),
      );
    };

    const filterChange = async () => {
      if (prevSearchParamsRef.current !== searchParams) {
        setCurrentPage(1);
        prevSearchParamsRef.current = searchParams;
      }

      setLoadMsg({
        message: uiText.loadingStates.loading,
        type: "normal",
      });
      const skip = (currentPage - 1) * TAG_RECORDS_PER_PAGE;
      const newSearchParams = {
        ...searchParams,
        skip: skip,
      };

      try {
        const updatedTags = await getTags(newSearchParams);
        setTags(updatedTags);
        setLoadMsg({
          message: null,
          type: "normal",
        });
      } catch (err) {
        setLoadMsg({
          message: uiText.loadingStates.error,
          type: "error",
        });

        console.error(uiText.criticalError, err);
      }
    };

    void filterChange();

    void fetchTagCategories();
  }, [searchParams, currentPage]);

  const recordsAvailable = tags ? tags["@odata.count"] : 0;

  return (
    <main className="page-main">
      <header>
        <h3>{uiText.title}</h3>
      </header>

      {loadMsg.message !== null ? (
        <LoadStatusMsgBar message={loadMsg.message} type={loadMsg.type} />
      ) : (
        <div className="space-y-4">
          {tags === null || tags.value.length === 0 ? (
            <p>{uiText.noDataAvailable}</p>
          ) : (
            <ODataTable
              cols={tableContent}
              values={parseODataTags(tags)}
              className="table-tags"
            />
          )}
          <TablePager
            currentPage={currentPage}
            recordsAvailable={recordsAvailable}
            onPageChange={setCurrentPage}
            recordsPerPage={TAG_RECORDS_PER_PAGE}
            paginated={3}
          />
        </div>
      )}
    </main>
  );
}
