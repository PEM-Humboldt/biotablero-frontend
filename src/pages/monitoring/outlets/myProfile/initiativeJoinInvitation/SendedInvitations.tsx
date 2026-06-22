import { useEffect, useRef, useState } from "react";

import { ODataTable } from "@composites/ODataTable";
import { TablePager } from "@composites/TablePager";
import { INITIATIVE_INVITATIONS_SEND_PER_PAGE } from "@config/monitoring";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { LoadingDiv } from "@ui/LoadingDiv";

import { getSendedJoinInitiativeInvitations } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { SendedJoinInitiativeInvitation } from "pages/monitoring/types/userJoinRequest";
import { sendedInvitationsTableStructure } from "pages/monitoring/outlets/myProfile/initiativeJoinInvitation/layout/sendedInvitationsTable";

export function SendedInvitations({ initiativeId }: { initiativeId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [sendedInvitations, setSendedInvitations] = useState<
    SendedJoinInitiativeInvitation[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalRecords = useRef(0);

  useEffect(() => {
    const fetchJoinInvitations = async () => {
      setIsLoading(true);
      const res = await getSendedJoinInitiativeInvitations(initiativeId, {
        top: INITIATIVE_INVITATIONS_SEND_PER_PAGE,
        skip: (currentPage - 1) * INITIATIVE_INVITATIONS_SEND_PER_PAGE,
        orderby: "creationDate desc",
      });

      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        setSendedInvitations([]);
        totalRecords.current = 0;
        return;
      }

      totalRecords.current = res["@odata.count"];
      setSendedInvitations(res.value);
    };

    void fetchJoinInvitations();
  }, [initiativeId, currentPage]);

  return isLoading ? (
    <LoadingDiv />
  ) : (
    <>
      <ErrorsList errorItems={errors} />
      <ODataTable
        cols={sendedInvitationsTableStructure}
        values={sendedInvitations}
        className="table-invitations"
      />
      <TablePager
        currentPage={currentPage}
        recordsAvailable={totalRecords.current}
        onPageChange={setCurrentPage}
        paginated={3}
        recordsPerPage={INITIATIVE_INVITATIONS_SEND_PER_PAGE}
      />
    </>
  );
}
