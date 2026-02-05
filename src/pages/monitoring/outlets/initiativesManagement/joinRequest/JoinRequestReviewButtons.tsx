import { Ban, SquareCheckBig } from "lucide-react";

import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { Button } from "@ui/shadCN/component/button";
import type { ODataInitiativeUserRequest } from "pages/monitoring/types/requestParams";

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
        title="aceptar solicitud"
        onClick={() => void handleApprove(request)}
      >
        <span className="sr-only">aceptar solicitud</span>
        <SquareCheckBig aria-hidden="true" className="size-5" />
      </Button>
      <Button
        size="icon"
        variant="ghost-clean"
        title="rechazar solicitud"
        onClick={() => void handleReject(request)}
      >
        <span className="sr-only">rechazar solicitud</span>
        <Ban aria-hidden="true" className="size-5" />
      </Button>
    </ButtonGroup>
  );
}
