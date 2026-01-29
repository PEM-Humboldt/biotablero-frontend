import { ODataParams } from "@appTypes/odata";
import { TablePager } from "@composites/TablePager";
import { useState } from "react";

const REQUESTS_PER_PAGE = 5;

export function InitiativesManagement() {
  const [userRequests, setUserRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [requestsFound, setRequestsFound] = useState<number>(0);
  const [filterParams, setFilterParams] = useState<ODataParams>({
    top: REQUESTS_PER_PAGE,
    orderby: "creationDate desc",
  });

  return (
    <div className="ml-[60px] bg-[#f5f5f5] p-4 *:max-w-6xl flex flex-col gap-4 items-center min-h-screen">
      <div className="p-6 pb-0 w-full flex justify-between">
        <h3 className="h1 text-primary">Nuevos miembros de la iniciativa</h3>
      </div>
      <div>LAS SOLICITUDES</div>

      <TablePager
        currentPage={currentPage}
        recordsAvailable={requestsFound}
        onPageChange={setCurrentPage}
        recordsPerPage={REQUESTS_PER_PAGE}
        paginated={3}
      />
    </div>
  );
}
