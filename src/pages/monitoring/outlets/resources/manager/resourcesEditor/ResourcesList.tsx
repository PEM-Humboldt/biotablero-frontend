import { type Dispatch, type SetStateAction } from "react";
import { SquarePen, Trash } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { useUserCTX } from "@hooks/UserContext";
import { DestructiveConfirmationDialog } from "@ui/DestructiveConfirmationDialog";

import type {
  MonitoringResource,
  ResourceType,
} from "pages/monitoring/types/odataResponse";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { uiText } from "pages/monitoring/outlets/resources/manager/resourcesEditor/layout/uiText";

export function ResourcesList({
  resources,
  setEditResource,
  removeResource,
  resourceType,
}: {
  resources: MonitoringResource[];
  setEditResource: Dispatch<SetStateAction<number | null>>;
  removeResource: (resourceId: number, resourceName: string) => Promise<void>;
  resourceType: ResourceType;
}) {
  const { user } = useUserCTX();
  const { userInitiativesById } = useUserInMonitoringCTX();

  return (
    <div>
      <h3 className="text-primary">{uiText.resourcesList.title}</h3>
      <div className="table-form-display-container ">
        <table className="table-form-display py-0!">
          <caption className="sr-only">
            {uiText.resourcesList.srCaption(resourceType.name)}
          </caption>

          <thead>
            <tr>
              <td className="w-[60%]">{uiText.resourcesList.headers[0]}</td>
              <td className="w-[40%]">{uiText.resourcesList.headers[1]}</td>
              <td className="w-18">
                <span className="sr-only">
                  {uiText.resourcesList.headers[2]}
                </span>
              </td>
            </tr>
          </thead>

          <tbody>
            {resources.map((resource) => (
              <tr key={`resourceItem_${resource.id}`}>
                <td>
                  {resource.name}
                  {uiText.resourcesList.madeByOther(
                    resource.authorUserName &&
                      resource.authorUserName !== user?.username
                      ? resource.authorUserName
                      : null,
                  )}
                </td>
                <td>
                  {userInitiativesById[resource.initiativeId]?.name ?? ""}
                </td>
                <td className="table-form-actions">
                  <Button
                    type="button"
                    onClick={() => setEditResource(resource.id)}
                    variant="ghost-clean"
                    size="icon-sm"
                    title={uiText.resourcesList.edit.title}
                  >
                    {uiText.resourcesList.edit.label}
                    <span className="sr-only">
                      {uiText.resourcesList.edit.sr}
                    </span>
                    <SquarePen className="size-4" aria-hidden="true" />
                  </Button>
                  <DestructiveConfirmationDialog
                    texts={{
                      trigger: {
                        ...uiText.resourcesList.del.trigger,
                        icon: Trash,
                      },
                      dialog: {
                        title: uiText.resourcesList.del.dialog.title(
                          resource.name,
                        ),
                        description:
                          uiText.resourcesList.del.dialog.description,
                      },
                    }}
                    triggerBtnVariant="ghost-clean"
                    triggerBtnSize="icon-sm"
                    handler={() =>
                      void removeResource(resource.id, resource.name)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
