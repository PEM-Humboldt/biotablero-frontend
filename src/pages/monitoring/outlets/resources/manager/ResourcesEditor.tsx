import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SquarePen, Trash } from "lucide-react";

import { LoadingDiv } from "@ui/LoadingDiv";
import { RESOURCES_MAX_ITEMS_EDIT_LIST } from "@config/monitoring";
import { Button } from "@ui/shadCN/component/button";
import { useUserCTX } from "@hooks/UserContext";
import { TablePager } from "@composites/TablePager";
import { ErrorsList } from "@ui/LabelingWithErrors";

import type {
  MonitoringResource,
  ResourceType,
} from "pages/monitoring/types/odataResponse";
import {
  deleteResource,
  getEditableResourcesByUser,
} from "pages/monitoring/api/services/monitoringResources";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { DestructiveConfirmationDialog } from "@ui/DestructiveConfirmationDialog";
import { toast } from "sonner";

export function ResourcesEditor({
  resourceType,
}: {
  resourceType: ResourceType;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [currentEdit, setCurrentEdit] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [resources, setResources] = useState<MonitoringResource[]>([]);
  const totalResources = useRef<number>(0);
  const { user } = useUserCTX();
  const { userInitiativesAs } = useUserInMonitoringCTX();
  const [helper, setHelper] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    setErrors([]);

    const filters: string[] = [];
    const initiativesAsLeader = userInitiativesAs[RoleInInitiative.LEADER]
      ? userInitiativesAs[RoleInInitiative.LEADER].map((i) => i.id)
      : undefined;

    if (user && user.username) {
      filters.push(`authorUserName eq '${user.username}'`);
    }

    if (initiativesAsLeader && initiativesAsLeader.length > 0) {
      filters.push(`initiativeId in (${initiativesAsLeader.join(",")})`);
    }

    const resourcesAvailable = await getEditableResourcesByUser({
      filter: `resourceType/id eq ${resourceType.id} and (${filters.join(" or ")})`,
      top: RESOURCES_MAX_ITEMS_EDIT_LIST,
      skip: (currentPage - 1) * RESOURCES_MAX_ITEMS_EDIT_LIST,
    });

    setIsLoading(false);
    if (isMonitoringAPIError(resourcesAvailable)) {
      setErrors(resourcesAvailable.data.map((err) => err.msg));
      return;
    }

    setResources(resourcesAvailable.value);
    totalResources.current = resourcesAvailable["@odata.count"];
    setIsLoading(false);
  }, [user, userInitiativesAs, currentPage, resourceType.id]);

  const removeResource = async (resourceId: number, resourceName: string) => {
    const res = await deleteResource(resourceId);
    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      return;
    }

    await fetchResources();
    toast("Recurso eliminado", {
      position: "bottom-right",
      description: `El recurso de monitoreo '${resourceName}' fue eliminado exitosamente y ya no se encuentra disponible`,
      icon: <Trash className="size-8 text-accent" />,
      className: "px-6! gap-6! border-2! border-accent!",
      duration: 3 * 1000,
    });
  };

  useEffect(() => {
    void fetchResources();
  }, [fetchResources]);

  return isLoading ? (
    <LoadingDiv className="text-center bg-background" />
  ) : (
    <>
      <ErrorsList
        errorItems={errors}
        className="border border-accent px-2 py-1 rounded-lg bg-background"
      />

      <div className="flex gap-4 *:flex-1">
        <div>
          {resources.length > 0 && (
            <ResourcesListEditor
              {...{ resources, setCurrentEdit, removeResource }}
            />
          )}
          <TablePager
            currentPage={currentPage}
            recordsAvailable={totalResources.current}
            onPageChange={setCurrentPage}
            recordsPerPage={RESOURCES_MAX_ITEMS_EDIT_LIST}
            paginated={3}
          />
        </div>
        <div>
          {resourceType.description} / {helper ?? "nanai"}
        </div>
      </div>
    </>
  );
}

function ResourcesListEditor({
  resources,
  setCurrentEdit,
  removeResource,
}: {
  resources: MonitoringResource[];
  setCurrentEdit: Dispatch<SetStateAction<number | null>>;
  removeResource: (resourceId: number, resourceName: string) => Promise<void>;
}) {
  const { user } = useUserCTX();
  const { userInitiativesById } = useUserInMonitoringCTX();

  if (resources.length === 0) {
    return null;
  }

  return (
    <div className="table-form-display-container">
      <table className="table-form-display">
        <caption className="sr-only">
          Recursos sobre {resources[0].resourceType.name} que puedes administrar
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
                  onClick={() => setCurrentEdit(resource.id)}
                  variant="ghost-clean"
                  size="icon-sm"
                  title="Editar"
                >
                  <span className="sr-only">Editar recurso</span>
                  <span aria-hidden="true">
                    <SquarePen className="size-4" />
                  </span>
                </Button>{" "}
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
  );
}
