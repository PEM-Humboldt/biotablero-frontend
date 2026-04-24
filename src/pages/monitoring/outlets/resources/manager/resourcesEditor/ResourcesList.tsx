import { type Dispatch, type SetStateAction } from "react";
import { SquarePen, Trash } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import { useUserCTX } from "@hooks/UserContext";
import { DestructiveConfirmationDialog } from "@ui/DestructiveConfirmationDialog";

import type { MonitoringResource } from "pages/monitoring/types/odataResponse";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";

export function ResourcesList({
  resources,
  setEditResource,
  removeResource,
}: {
  resources: MonitoringResource[];
  setEditResource: Dispatch<SetStateAction<number | null>>;
  removeResource: (resourceId: number, resourceName: string) => Promise<void>;
}) {
  const { user } = useUserCTX();
  const { userInitiativesById } = useUserInMonitoringCTX();

  return (
    <div className="flex flex-wrap *:flex-1 gap-8 p-4 pb-2">
      <div className="table-form-display-container ">
        <table className="table-form-display py-0!">
          <caption className="sr-only">
            Recursos sobre {resources[0].resourceType.name} que puedes
            administrar
          </caption>

          <thead>
            <tr>
              <td className="w-[60%]">Nombre</td>
              <td className="w-[40%]">Iniciativa</td>
              <td className="w-18">
                <span className="sr-only">acciones</span>
              </td>
            </tr>
          </thead>

          <tbody>
            {resources.map((resource) => (
              <tr key={`resourceItem_${resource.id}`}>
                <td>
                  {resource.name}
                  {resource.authorUserName &&
                  resource.authorUserName !== user?.username
                    ? ` por ${resource.authorUserName}`
                    : ""}
                </td>
                <td>{userInitiativesById[resource.initiativeId].name}</td>
                <td className="table-form-actions">
                  <Button
                    type="button"
                    onClick={() => setEditResource(resource.id)}
                    variant="ghost-clean"
                    size="icon-sm"
                    title="Editar"
                  >
                    <span className="sr-only">Editar recurso</span>
                    <span aria-hidden="true">
                      <SquarePen className="size-4" />
                    </span>
                  </Button>
                  <DestructiveConfirmationDialog
                    texts={{
                      trigger: {
                        title: "Borrar",
                        sr: "BorrarRecurso",
                        label: "",
                        icon: Trash,
                      },
                      dialog: {
                        title: `¿Deseas eliminar el recurso '${resource.name}'?`,
                        description:
                          "Al eliminar este recurso todo su contenido será eliminado y dejará de estar disponible para todas las personas",
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

      <div>{resources[0].resourceType.description}</div>
    </div>
  );
}
