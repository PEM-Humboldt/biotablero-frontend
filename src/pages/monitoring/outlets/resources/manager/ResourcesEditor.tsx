import { useCallback, useEffect, useRef, useState } from "react";
import { NotebookPen, Trash } from "lucide-react";

import { LoadingDiv } from "@ui/LoadingDiv";
import { RESOURCES_MAX_ITEMS_EDIT_LIST } from "@config/monitoring";
import { useUserCTX } from "@hooks/UserContext";
import { TablePager } from "@composites/TablePager";
import { ErrorsList } from "@ui/LabelingWithErrors";

import type {
  MonitoringResource,
  ResourceType,
} from "pages/monitoring/types/odataResponse";
import {
  removeResource,
  getResources,
} from "pages/monitoring/api/services/monitoringResources";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { toast } from "sonner";
import { Button } from "@ui/shadCN/component/button";
import { ResourcesList } from "pages/monitoring/outlets/resources/manager/resourcesEditor/ResourcesList";
import { ResourceForm } from "pages/monitoring/outlets/resources/manager/resourcesEditor/ResourceForm";
import { ResourceInfo } from "pages/monitoring/outlets/resources/manager/resourcesEditor/ResourceInfo";

export function ResourcesEditor({
  resourceType,
}: {
  resourceType: ResourceType;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [resources, setResources] = useState<MonitoringResource[]>([]);
  const [editResource, setEditResource] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { user } = useUserCTX();
  const { userInitiativesAs } = useUserInMonitoringCTX();
  const totalResources = useRef<number>(0);

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

    const resourcesAvailable = await getResources({
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

  useEffect(() => {
    void fetchResources();
  }, [fetchResources]);

  const deleteResource = async (resourceId: number, resourceName: string) => {
    const res = await removeResource(resourceId);
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

  const onSubmitSuccess = () => {
    void fetchResources();
    setEditResource(null);
  };

  return isLoading ? (
    <LoadingDiv className="text-center bg-background" />
  ) : (
    <div className="p-4">
      <ErrorsList
        errorItems={errors}
        className="border border-accent px-2 py-1 rounded-lg bg-background"
      />

      {resources.length > 0 && editResource === null ? (
        <div className="flex flex-wrap *:flex-1 gap-12 p-4 pb-2">
          <div>
            <ResourceInfo currentHelper={null} resourceType={resourceType} />

            <Button
              className="w-full my-4"
              onClick={() => setEditResource(0)}
              variant="default"
              size="lg"
            >
              Crear nuevo recurso
              <NotebookPen />
            </Button>
          </div>
          <div>
            <ResourcesList
              resources={resources}
              setEditResource={setEditResource}
              removeResource={deleteResource}
              resourceType={resourceType}
            />

            <TablePager
              currentPage={currentPage}
              recordsAvailable={totalResources.current}
              onPageChange={setCurrentPage}
              recordsPerPage={RESOURCES_MAX_ITEMS_EDIT_LIST}
              paginated={3}
              className="pb-4"
            />
          </div>
        </div>
      ) : (
        <ResourceForm
          resourceId={editResource}
          onSubmitSuccess={onSubmitSuccess}
          resourceType={resourceType}
        />
      )}
    </div>
  );
}
