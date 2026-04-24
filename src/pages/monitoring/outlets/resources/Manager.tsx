import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Button } from "@ui/shadCN/component/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/shadCN/component/tabs";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { LoadingDiv } from "@ui/LoadingDiv";

import type { ResourceType } from "pages/monitoring/types/odataResponse";
import { getResourcesType } from "pages/monitoring/api/services/monitoringResources";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { ResourcesEditor } from "pages/monitoring/outlets/resources/manager/ResourcesEditor";

export function Manager() {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [resourcesType, setResourcesType] = useState<ResourceType[]>([]);

  useEffect(() => {
    const fetchResourcesType = async () => {
      const res = await getResourcesType();
      setIsLoading(false);

      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      setResourcesType(res.value);
    };

    void fetchResourcesType();
  }, []);

  return isLoading ? (
    <LoadingDiv className="text-center bg-background" />
  ) : (
    <main className="page-main">
      <ErrorsList errorItems={errors} />

      <header>
        <h3>Administrador de recursos para monitoreo</h3>
        <Button asChild>
          <Link to="/Monitoreo/Recursos">Cerrar el administrador</Link>
        </Button>
      </header>

      {errors.length === 0 && resourcesType.length > 0 && (
        <Tabs defaultValue={resourcesType[0].name} className="common-tabs">
          <TabsList className="tabs-list">
            {resourcesType.map((tab) => (
              <TabsTrigger
                key={`trigger_${tab.name}`}
                value={tab.name}
                className="tabs-trigger"
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {resourcesType.map((resourceType) => (
            <TabsContent
              value={resourceType.name}
              key={`content_${resourceType.name}`}
              className="tabs-content"
            >
              <ResourcesEditor {...{ resourceType }} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </main>
  );
}
