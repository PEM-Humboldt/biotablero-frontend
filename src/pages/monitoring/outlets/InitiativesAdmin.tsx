import { useCallback, useEffect, useRef, useState } from "react";

import type { ODataParams } from "@appTypes/odata";
import { ODataSearchBar } from "@composites/ODataSearchBar";
import { INITIATIVES_PER_PAGE } from "@config/monitoring";
import { Button } from "@ui/shadCN/component/button";

import { searchBarItems } from "pages/monitoring/outlets/initiativesAdmin/layout/searchBarContent";
import {
  getInitiatives,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import { TablePager } from "@composites/TablePager";
import { InitiativeDataForm } from "pages/monitoring/outlets/initiativesAdmin/InitiativeDataForm";
import { CircleXIcon, ListPlus } from "lucide-react";
import type {
  InitiativeDisplayInfo,
  InitiativeDisplayInfoShort,
  InitiativeFullInfo,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { makeLocationObj } from "pages/monitoring/outlets/initiativesAdmin/utils/builders";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/shadCN/component/accordion";

import { InitiativeCard } from "pages/monitoring/outlets/initiativesAdmin/InitiativeCard";
import { InitiativeTag } from "pages/monitoring/outlets/initiativesAdmin/InitiativeTag";
import { cn } from "@ui/shadCN/lib/utils";

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

  useEffect(() => {
    const loadInitiatives = async () => {
      if (prevSearchParamsRef.current !== searchParams) {
        setCurrentPage(1);
        prevSearchParamsRef.current = searchParams;
      }

      const skip = (currentPage - 1) * INITIATIVES_PER_PAGE;
      const newSearchParams = { ...searchParams, skip };

      try {
        const res = await getInitiatives(newSearchParams);

        if (isMonitoringAPIError(res)) {
          console.log("pailas");
          setInitiatives(null);
          setInitiativesFound(0);
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

        setInitiatives(initiativesObj);
        setInitiativesFound(res["@odata.count"]);
      } catch (err) {
        console.error(err);
      }
    };

    void loadInitiatives();
  }, [searchParams, currentPage]);

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

  return (
    <div className="ml-[60px] bg-[#f5f5f5] p-4 *:max-w-6xl flex flex-col gap-4 items-center min-h-screen">
      <div className="p-6 pb-0 w-full flex justify-between">
        <h3 className="h1 text-primary">Administrador de iniciativas</h3>
        <Button onClick={() => setNewInitiative((v) => !v)}>
          {newInitiative
            ? "Cancelar creación de una nueva iniciativa"
            : "Crear iniciativa"}
          {newInitiative ? <CircleXIcon /> : <ListPlus />}
        </Button>
      </div>

      {newInitiative ? (
        <InitiativeDataForm />
      ) : (
        <>
          <ODataSearchBar
            components={searchBarItems}
            setSearchParams={setSearchParams}
            reset={"reset"}
            className="bg-muted w-full"
          />

          {initiatives === null ? (
            <div>No hay iniciativas</div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {[...initiatives.entries()].map(([id, initiative]) => (
                <AccordionItem value={String(id)} key={String(id)}>
                  <AccordionTrigger
                    className={cn(
                      !initiative.enabled &&
                        "bg-red-50 data-[state=open]:bg-accent",
                    )}
                  >
                    <InitiativeTag initiative={initiative} />
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
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
    </div>
  );
}
