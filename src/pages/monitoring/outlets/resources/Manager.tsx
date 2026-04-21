import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "@ui/shadCN/component/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/shadCN/component/tabs";
import { useUserCTX } from "@hooks/UserContext";
import { ErrorsList } from "@ui/LabelingWithErrors";

import type { ResourceType } from "pages/monitoring/types/odataResponse";
import { getResourcesType } from "pages/monitoring/api/services/monitoringResources";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { ResourcesEditor } from "pages/monitoring/outlets/resources/manager/ResourcesEditor";

export function Manager() {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [resourcesType, setResourcesType] = useState<ResourceType[]>([]);
  const { user } = useUserCTX();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      void navigate("/Monitoreo/Recursos");
      return;
    }

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
  }, [user, navigate]);

  return isLoading ? (
    <div>Cargando...</div>
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
              <div className="p-4 space-y-4">
                <div>{resourceType.description}</div>
                <ResourcesEditor {...{ resourceType }} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </main>
  );
}
