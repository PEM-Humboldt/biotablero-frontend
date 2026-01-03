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
import { updateMock } from "./initiativesAdmin/updateMock";

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
    <div className="ml-[60px] bg-grey-light">
      <div className="bg-red-100 text-3xl text-center my-8 p-8 ">
        <h3>Administrador de iniciativas</h3>
        <Button>Crear iniciativa</Button>
      </div>

      <ODataSearchBar
        components={searchBarItems}
        setSearchParams={setSearchParams}
        reset={"reset"}
        className="bg-red-500"
      />

      <InitiativeDataForm />

      <div className="bg-red-100 text-3xl text-center my-8 p-8 ">
        iniciativas
        <div className="bg-red-300 my-8">formulario edicion</div>
        <div className="bg-red-300 my-8">barra iniciativa</div>
      </div>

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
