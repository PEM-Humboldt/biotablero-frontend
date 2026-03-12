import { useEffect, useRef, useState } from "react";

import { uiText } from "pages/monitoring/outlets/tagsAdmin/layout/uiText";
import {
  getTags,
} from "pages/monitoring/api/services/tags";
import { LoadStatusMsgBar, LoadStatusMsgBarProp } from "@ui/loadStatusSecction";
import { ODataParams } from "@appTypes/odata";
import { TAG_RECORDS_PER_PAGE } from "@config/monitoring";
import { ODataTag, ODataTagInfo, TagEntryShort } from "pages/monitoring/types/odataResponse";
import { ODataTable } from "@composites/ODataTable";
import { TablePager } from "@composites/TablePager";
import { tableContent } from "pages/monitoring/outlets/tagsAdmin/layout/tableContent";
import { translateTagCategory } from "pages/monitoring/outlets/tagsAdmin/utils/tagCategoryTranslator";
import { TagFormButton } from "pages/monitoring/outlets/tagsAdmin/TagFormBtn";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

function parseEntry(rawODataTag: ODataTag): TagEntryShort {
  return {
    ...rawODataTag,
    categoryName: translateTagCategory(rawODataTag.category.name),
    url: rawODataTag.url || "",
  };
}

function parseODataTags(odataTags: ODataTagInfo): TagEntryShort[] {
  const { value } = odataTags;
  return value.map(parseEntry);
}

export function TagsAdmin() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tags, setTags] = useState<ODataTagInfo | null>(null);
  const [loadMsg, setLoadMsg] = useState<LoadStatusMsgBarProp>({
    message: uiText.loadingStates.loading,
    type: "normal",
  });
  const [searchParams] = useState<ODataParams>({
    top: TAG_RECORDS_PER_PAGE,
    orderby: "id asc",
  });
  const prevSearchParamsRef = useRef(searchParams);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
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
        if (isMonitoringAPIError(updatedTags)) {
          setTags(null);
          return;
        }

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
  }, [searchParams, currentPage, refetchTrigger]);

  const recordsAvailable = tags ? tags["@odata.count"] : 0;

  return (
    <main className="page-main">
      <header>
        <h3>{uiText.title}</h3>
        <div className="max-w-[500px] text-right text-base">
          <TagFormButton onActionSuccess={() => setRefetchTrigger(prev => prev + 1)} />
        </div>
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
              onActionSuccess={() => setRefetchTrigger(prev => prev + 1)}
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
