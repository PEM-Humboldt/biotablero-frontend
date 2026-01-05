import { useEffect, useRef, useState } from "react";

import type { ODataParams } from "@appTypes/odata";
import { ODataSearchBar } from "@composites/ODataSearchBar";
import { INITIATIVES_PER_PAGE } from "@config/monitoring";
import { Button } from "@ui/shadCN/component/button";

import { searchBarItems } from "pages/monitoring/outlets/initiativesAdmin/layout/searchBarContent";
import type { ODataInitiative } from "pages/monitoring/types/requestParams";
import { getInitiatives } from "pages/monitoring/api/monitoringAPI";
import { TablePager } from "@composites/TablePager";
import { InitiativeDataForm } from "pages/monitoring/outlets/initiativesAdmin/InitiativeDataForm";
import { ListPlus } from "lucide-react";
import { InitiativesDisplay } from "./initiativesAdmin/InitiativesDisplay";

export function InitiativesAdmin() {
  const [initiatives, setInitiatives] = useState<ODataInitiative | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchParams, setSearchParams] = useState<ODataParams>({
    top: INITIATIVES_PER_PAGE,
    orderby: "creationDate desc",
  });
  const prevSearchParamsRef = useRef(searchParams);

  // NOTE: desplegar la iniciativa que está como param en la url

  useEffect(() => {
    const loadInitiatives = async () => {
      if (prevSearchParamsRef.current !== searchParams) {
        setCurrentPage(1);
        prevSearchParamsRef.current = searchParams;
      }

      const skip = (currentPage - 1) * INITIATIVES_PER_PAGE;
      const newSearchParams = { ...searchParams, skip };

      try {
        const initiativesUpdated = await getInitiatives(newSearchParams);
        console.log(initiativesUpdated.value);
        setInitiatives(initiativesUpdated);
      } catch (err) {
        console.error(err);
      }
    };

    void loadInitiatives();
  }, [searchParams, currentPage]);

  const initiativesAvailable = initiatives ? initiatives["@odata.count"] : 0;

  return (
    <div className="ml-[60px] bg-[#f5f5f5] p-4 *:max-w-6xl flex flex-col gap-4 items-center min-h-screen">
      <div className="p-6 pb-0 w-full flex justify-between">
        <h3 className="h1 text-primary">Administrador de iniciativas</h3>
        <Button>
          Crear iniciativa <ListPlus />
        </Button>
      </div>

      <ODataSearchBar
        components={searchBarItems}
        setSearchParams={setSearchParams}
        reset={"reset"}
        className="bg-muted w-full"
      />

      {true && <InitiativeDataForm />}

      <InitiativesDisplay initiativesInfo={initiatives?.value ?? []} />

      <TablePager
        currentPage={currentPage}
        recordsAvailable={initiativesAvailable}
        onPageChange={setCurrentPage}
        recordsPerPage={INITIATIVES_PER_PAGE}
        paginated={3}
      />
    </div>
  );
}
