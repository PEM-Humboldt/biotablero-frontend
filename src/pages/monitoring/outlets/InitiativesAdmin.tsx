import { useCallback, useEffect, useRef, useState } from "react";

import type { ODataParams } from "@appTypes/odata";
import { ODataSearchBar } from "@composites/ODataSearchBar";
import { INITIATIVES_PER_PAGE } from "@config/monitoring";
import { Button } from "@ui/shadCN/component/button";

import { searchBarItems } from "pages/monitoring/outlets/initiativesAdmin/layout/searchBarContent";
import { getInitiatives } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { TablePager } from "@composites/TablePager";
import { InitiativeDataForm } from "pages/monitoring/outlets/initiativesAdmin/InitiativeDataForm";
import { CircleXIcon, ListPlus } from "lucide-react";
import type {
  InitiativeDisplayInfo,
  InitiativeDisplayInfoShort,
  InitiativeFullInfo,
} from "pages/monitoring/types/initiative";
import { makeLocationObj } from "pages/monitoring/ui/initiativesAdmin/utils/builders";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/shadCN/component/accordion";

import { InitiativeCard } from "pages/monitoring/outlets/initiativesAdmin/InitiativeCard";
import { InitiativeTag } from "pages/monitoring/outlets/initiativesAdmin/InitiativeTag";
import { cn } from "@ui/shadCN/lib/utils";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { uiText } from "pages/monitoring/outlets/initiativesAdmin/layout/uiText";

export function InitiativesAdmin() {
  const [initiatives, setInitiatives] = useState<Map<
    number,
    InitiativeDisplayInfoShort | InitiativeDisplayInfo
  > | null>(null);
  const [initiativesFound, setInitiativesFound] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchParams, setSearchParams] = useState<ODataParams>({
    top: INITIATIVES_PER_PAGE,
    orderby: "creationDate desc",
  });
  const [newInitiative, setNewInitiative] = useState(false);
  const prevSearchParamsRef = useRef(searchParams);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const loadInitiatives = useCallback(async () => {
    if (prevSearchParamsRef.current !== searchParams) {
      setCurrentPage(1);
      prevSearchParamsRef.current = searchParams;
    }

    const skip = (currentPage - 1) * INITIATIVES_PER_PAGE;
    const newSearchParams = { ...searchParams, skip };

    const res = await getInitiatives(newSearchParams);

    if (isMonitoringAPIError(res)) {
      setError(res.data[0].msg);
      setInitiatives(null);
      setInitiativesFound(0);
      setLoading(false);
      return;
    }

    const initiativesObj: Map<number, InitiativeDisplayInfoShort> =
      res.value.reduce((acc, cur) => {
        const updatedEntry = {
          ...cur,
          locations: cur.locations.map(makeLocationObj),
        };
        acc.set(cur.id, updatedEntry);
        return acc;
      }, new Map<number, InitiativeDisplayInfoShort>());

    setError("");
    setInitiatives(initiativesObj);
    setInitiativesFound(res["@odata.count"]);
  }, [searchParams, currentPage]);

  useEffect(() => {
    void loadInitiatives();
  }, [loadInitiatives]);

  const initiativeUpdater = useCallback((value: InitiativeFullInfo) => {
    const updatedValue = {
      ...value,
      locations: value.locations.map(makeLocationObj),
    } satisfies InitiativeDisplayInfo;

    setInitiatives((oldInitiatives) => {
      const newMap = new Map(oldInitiatives);
      newMap.set(value.id, updatedValue);
      return newMap;
    });
  }, []);

  const onCreateSuccess = () => {
    setNewInitiative(false);
    void loadInitiatives();
  };

  return (
    <main className="page-main">
      <header>
        <h3>{uiText.title}</h3>
        <Button onClick={() => setNewInitiative((v) => !v)}>
          {newInitiative
            ? uiText.initiative.cancelCreation
            : uiText.initiative.createNew}
          {newInitiative ? <CircleXIcon /> : <ListPlus />}
        </Button>
      </header>

      {error !== "" && <ErrorsList errorItems={[error]} />}

      {newInitiative ? (
        <InitiativeDataForm onSuccess={onCreateSuccess} />
      ) : (
        <>
          <ODataSearchBar
            components={searchBarItems}
            setSearchParams={setSearchParams}
            reset={"reset"}
            className="bg-muted w-full"
          />

          {initiatives === null ? (
            <div className="text-2xl text-primary font-semibold p-10">
              {loading ? uiText.loading : uiText.initiative.noInitiatives}
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {[...initiatives.entries()].map(([id, initiative]) => (
                <AccordionItem value={String(id)} key={String(id)}>
                  <AccordionTrigger
                    className={cn(
                      !initiative.enabled &&
                        "bg-red-50 hover:bg-accent! data-[state=open]:bg-accent",
                    )}
                  >
                    <InitiativeTag initiative={initiative} />
                  </AccordionTrigger>
                  <AccordionContent className="p-0">
                    <InitiativeCard
                      initiative={initiative}
                      updater={initiativeUpdater}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          <TablePager
            currentPage={currentPage}
            recordsAvailable={initiativesFound}
            onPageChange={setCurrentPage}
            recordsPerPage={INITIATIVES_PER_PAGE}
            paginated={3}
          />
        </>
      )}
    </main>
  );
}
