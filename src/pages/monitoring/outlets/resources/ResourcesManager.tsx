import { Link, useNavigate } from "react-router";

import { Button } from "@ui/shadCN/component/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/shadCN/component/tabs";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  MonitoringResource,
  ResourceType,
} from "pages/monitoring/types/odataResponse";
import {
  getEditableResourcesByUser,
  getResourcesType,
} from "pages/monitoring/api/services/monitoringResources";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { useUserCTX } from "@hooks/UserContext";
import { RoleInInitiative } from "pages/monitoring/types/catalog";

type ResourcesByType = Map<ResourceType, MonitoringResource[]>;

export function ResourcesManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [resourcesByType, setResourcesByType] = useState<ResourcesByType>(
    new Map(),
  );
  const { userInitiativesAs } = useUserInMonitoringCTX();

  const navigate = useNavigate();
  const { user } = useUserCTX();

  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    setErrors([]);

    const [resourceTypes, resourcesAvailable] = await Promise.all([
      getResourcesType(),
      getEditableResourcesByUser(
        user!.username,
        userInitiativesAs[RoleInInitiative.LEADER]
          ? userInitiativesAs[RoleInInitiative.LEADER].map((i) => i.id)
          : undefined,
      ),
    ]);

    setIsLoading(false);
    if (isMonitoringAPIError(resourceTypes)) {
      setErrors(resourceTypes.data.map((err) => err.msg));
      return;
    }
    if (isMonitoringAPIError(resourcesAvailable)) {
      setErrors(resourcesAvailable.data.map((err) => err.msg));
      return;
    }

    const resources: ResourcesByType = new Map();
    for (const resourceType of resourceTypes.value) {
      resources.set(
        resourceType,
        resourcesAvailable.value.filter(
          (r) => r.resourceType.id === resourceType.id,
        ),
      );
    }

    setResourcesByType(resources);
    setIsLoading(false);
  }, [user, userInitiativesAs]);

  useEffect(() => {
    void fetchResources();
  }, [fetchResources]);

  const tabsInfo = useMemo(
    () => [...resourcesByType.keys()],
    [resourcesByType],
  );

  if (!user) {
    void navigate("/Monitoreo/Recursos");
    return;
  }

  return (
    <main className="page-main">
      <header>
        <h3>Administrador de recursos para monitoreo</h3>
        <Button asChild>
          <Link to="/Monitoreo/Recursos">Cerrar el administrador</Link>
        </Button>
      </header>

      {errors.length === 0 && resourcesByType.size > 0 && (
        <Tabs defaultValue={tabsInfo[0].name} className="common-tabs">
          <TabsList className="tabs-list">
            {tabsInfo.map((tab) => (
              <TabsTrigger
                key={`trigger_${tab.name}`}
                value={tab.name}
                className="tabs-trigger"
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {[...resourcesByType.entries()].map(([resourceType, resources]) => (
            <TabsContent
              value={resourceType.name}
              key={`content_${resourceType.name}`}
              className="tabs-content"
            >
              <div className="p-4 space-y-4">
                <div>{resourceType.description}</div>
                <ResourcesEditor {...{ resourceType, resources }} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </main>
  );
}

function ResourcesEditor({
  resourceType,
  resources,
}: {
  resourceType: ResourceType;
  resources: MonitoringResource[];
}) {
  return (
    <div className="flex gap-4 *:border *:flex-1">
      <div>{resourceType.description}</div>
      <div>
        {resources.map((resource) => (
          <div>{resource.name}</div>
        ))}
      </div>
    </div>
  );
}
