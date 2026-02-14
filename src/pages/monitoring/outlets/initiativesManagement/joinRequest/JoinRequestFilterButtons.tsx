import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { Button } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";
import type { GetKeysWithStringValues } from "@appTypes/utils";

import type { ODataInitiativeUserRequest } from "pages/monitoring/types/odataResponse";
import type { Request } from "pages/monitoring/types/userJoinRequest";

type FilterJoinRequestsCallback = (
  status: Request,
  sortBy: GetKeysWithStringValues<ODataInitiativeUserRequest>,
  newerFirst?: boolean,
) => Promise<void>;

type FilterJoinRequestSettings = {
  label: string;
  status: Request;
  sortBy: GetKeysWithStringValues<ODataInitiativeUserRequest>;
  newerFirst: boolean;
};

export function JoinRequestFilterButtons({
  currentStatus,
  menuSettings,
  filteringCallback,
}: {
  currentStatus: Request | null;
  menuSettings: FilterJoinRequestSettings[];
  filteringCallback: FilterJoinRequestsCallback;
}) {
  return (
    <ButtonGroup>
      {menuSettings.map(({ label, status, sortBy, newerFirst }) => (
        <Button
          key={status}
          variant="outline"
          className={cn(
            currentStatus === status && "bg-primary text-primary-foreground",
          )}
          onClick={() => void filteringCallback(status, sortBy, newerFirst)}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
}
