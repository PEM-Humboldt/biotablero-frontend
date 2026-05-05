import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useParams } from "react-router";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { Button } from "@ui/shadCN/component/button";
import { Header } from "pages/monitoring/outlets/resources/Header";
import { Tabs } from "@ui/shadCN/component/tabs";
import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { MonitoringResource, ResourceType } from "../types/odataResponse";
import {
  getResource,
  getResources,
  getResourcesType,
} from "../api/services/monitoringResources";
import { isMonitoringAPIError } from "../api/types/guards";
import { LoadingDiv } from "@ui/LoadingDiv";
import { ErrorsList } from "@ui/LabelingWithErrors";

export function Resources() {
  const { userInitiativesAs } = useUserInMonitoringCTX();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [currentTab, setCurrentTab] = useState<number>(1);
  const [currentResource, setCurrentResource] =
    useState<MonitoringResource | null>(null);
  const { resourceId } = useParams();

  useEffect(() => {
    const fetchResourcesType = async () => {
      setIsLoading(true);
      const res = await getResourcesType();

      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setResourceTypes([]);
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      setResourceTypes(res.value);
    };
    void fetchResourcesType();
  }, []);

  useEffect(() => {
    if (!resourceId) {
      setCurrentResource(null);
    }

    const fetchCurrentResource = async () => {
      setIsLoading(true);
      const res = await getResource(Number(resourceId));

      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setCurrentResource(null);
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      setCurrentTab(res.resourceType.id);
      setCurrentResource(res);
    };

    void fetchCurrentResource();
  }, [resourceId]);

  const userLinkedInitiatives = useMemo(
    () => [
      ...(userInitiativesAs[RoleInInitiative.LEADER] ?? []),
      ...(userInitiativesAs[RoleInInitiative.USER] ?? []),
    ],
    [userInitiativesAs],
  );

  console.log(currentTab);

  return isLoading ? (
    <LoadingDiv />
  ) : (
    <div className="flex flex-col items-center bg-grey-form w-full">
      <Header />
      {userLinkedInitiatives.length > 0 && (
        <Button asChild>
          <Link to="/Monitoreo/Recursos/Admin">Administrar mis recursos</Link>
        </Button>
      )}

      <div className="bg-accent h-16 w-full">
        <Tabs
          value={String(currentTab)}
          onValueChange={(value: string) => setCurrentTab(Number(value))}
        >
          <TabsList>
            {resourceTypes.map((resType) => (
              <TabsTrigger
                key={`resourceTrigger_${resType.id}`}
                value={String(resType.id)}
              >
                {resType.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {currentResource && <div>{currentResource.name}</div>}

          {resourceTypes.map((resType) => (
            <TabsContent
              key={`resourceBrowser_${resType.id}`}
              value={String(resType.id)}
            >
              <ResourceTypeBrowser
                resourceType={resType.id}
                currentResourceId={currentResource?.id ?? null}
                setCurrentResource={setCurrentResource}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function ResourceTypeBrowser({
  resourceType,
  currentResourceId,
  setCurrentResource,
}: {
  resourceType: number;
  currentResourceId: null | number;
  setCurrentResource: Dispatch<SetStateAction<MonitoringResource | null>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [resources, setResources] = useState<MonitoringResource[]>([]);
  const searchResultsAmount = useRef(0);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      const res = await getResources({ filter: "" });

      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setResources([]);
        setErrors(res.data.map((err) => err.msg));
        searchResultsAmount.current = 0;
        return;
      }

      searchResultsAmount.current = res["@odata.count"];
      setResources(res.value);
    };

    void fetchResources();
  }, []);

  return isLoading ? (
    <LoadingDiv />
  ) : (
    <>
      <ErrorsList errorItems={errors} />

      {resources.map((resource) => (
        <div>{resource.name}</div>
      ))}
    </>
  );
}
