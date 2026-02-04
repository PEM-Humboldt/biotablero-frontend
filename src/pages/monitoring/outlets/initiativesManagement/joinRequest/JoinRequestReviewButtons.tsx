import { Ban, SquareCheckBig } from "lucide-react";

import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { Button } from "@ui/shadCN/component/button";

export function JoinRequestReviewButtons({
  requestId,
  handleApprove,
  handleReject,
}: {
  requestId: number;
  handleApprove: (requestId: number) => Promise<void> | void;
  handleReject: (requestId: number) => Promise<void> | void;
}) {
  return (
    <ButtonGroup className="flex justify-end w-full">
      <Button
        size="icon"
        variant="ghost-clean"
        title="aceptar solicitud"
        onClick={() => void handleApprove(requestId)}
      >
        <span className="sr-only">aceptar solicitud</span>
        <SquareCheckBig aria-hidden="true" className="size-5" />
      </Button>
      <Button
        size="icon"
        variant="ghost-clean"
        title="rechazar solicitud"
        onClick={() => void handleReject(requestId)}
      >
        <span className="sr-only">rechazar solicitud</span>
        <Ban aria-hidden="true" className="size-5" />
      </Button>
    </ButtonGroup>
  );
}
