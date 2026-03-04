import { Ban, SquareCheckBig } from "lucide-react";

import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { Button } from "@ui/shadCN/component/button";
import type { ODataInitiativeUserRequest } from "pages/monitoring/types/odataResponse";
import { uiText } from "pages/monitoring/outlets/initiativesManagement/joinRequest/layout/uiText";

export function JoinRequestReviewButtons({
  request,
  handleApprove,
  handleReject,
}: {
  request: ODataInitiativeUserRequest;
  handleApprove: (request: ODataInitiativeUserRequest) => Promise<void> | void;
  handleReject: (request: ODataInitiativeUserRequest) => Promise<void> | void;
}) {
  return (
    <ButtonGroup className="flex justify-end w-full">
      <Button
        size="icon"
        variant="ghost-clean"
        title={uiText.module.actionsOnRequest.aprove}
        onClick={() => void handleApprove(request)}
      >
        <span className="sr-only">{uiText.module.actionsOnRequest.aprove}</span>
        <SquareCheckBig aria-hidden="true" className="size-5" />
      </Button>
      <Button
        size="icon"
        variant="ghost-clean"
        title={uiText.module.actionsOnRequest.reject}
        onClick={() => void handleReject(request)}
      >
        <span className="sr-only">{uiText.module.actionsOnRequest.reject}</span>
        <Ban aria-hidden="true" className="size-5" />
      </Button>
    </ButtonGroup>
  );
}
