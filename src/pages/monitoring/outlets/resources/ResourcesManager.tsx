import { Link } from "react-router";

import { Button } from "@ui/shadCN/component/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/shadCN/component/tabs";
import { useEffect, useState } from "react";
import { ResourceType } from "pages/monitoring/types/odataResponse";
import { getResourcesType } from "pages/monitoring/api/services/monitoringResources";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

export function ResourcesManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [resourcesType, setResourcesType] = useState<ResourceType[]>([]);

  useEffect(() => {
    const fetchResourcesType = async () => {
      const res = await getResourcesType();
      if (isMonitoringAPIError(res)) {
        setIsLoading(false);
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      setResourcesType(res.value);
      setIsLoading(false);
    };

    void fetchResourcesType();
  }, []);

  return (
    <main className="page-main">
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

          {resourcesType.map((tab) => (
            <TabsContent
              value={tab.name}
              key={`content_${tab.name}`}
              className="tabs-content"
            >
              <h4>{tab.name}</h4>
              <div>{tab.description}</div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </main>
  );
}
