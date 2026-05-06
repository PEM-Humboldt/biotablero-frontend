import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { Button } from "@ui/shadCN/component/button";
import { Header } from "pages/monitoring/outlets/resources/Header";
import type {
  MonitoringResource,
  ResourceType,
} from "pages/monitoring/types/odataResponse";
import {
  getResource,
  getResources,
  getResourcesType,
} from "pages/monitoring/api/services/monitoringResources";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { LoadingDiv } from "@ui/LoadingDiv";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { ODataSearchBar } from "@composites/ODataSearchBar";
import type { ODataParams, SearchBarComponent } from "@appTypes/odata";
import { TablePager } from "@composites/TablePager";
import { makeSearchResourcesComponents } from "pages/monitoring/outlets/resources/layout/makeResourcesSearchBarComponents";
import { RESOURCES_PER_PAGE } from "@config/monitoring";

export function Resources() {
  const { userInitiativesAs } = useUserInMonitoringCTX();
  const { resourceId } = useParams();

  const [isLoading, setIsLoading] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [currentTab, setCurrentTab] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [resources, setResources] = useState<MonitoringResource[]>([]);
  const [currentResource, setCurrentResource] =
    useState<MonitoringResource | null>(null);
  const [searchBarComponents, setSearchBarComponents] = useState<
    SearchBarComponent<MonitoringResource>[] | null
  >(null);

  const [searchParams, setSearchParams] = useState<ODataParams>({
    top: RESOURCES_PER_PAGE,
    orderby: "publicationDate desc",
  });
  const prevSearchParamsRef = useRef(searchParams);
  const recordsAvailable = useRef(0);

  useEffect(() => {
    setIsLoading((prvLoads) => prvLoads + 1);
    const fetchResourcesType = async () => {
      const res = await getResourcesType();

      if (isMonitoringAPIError(res)) {
        setResourceTypes([]);
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      setResourceTypes(res.value);
    };

    const fetchSearchBarInfo = async () => {
      const res = await makeSearchResourcesComponents();
      setSearchBarComponents(res);
    };
    setIsLoading((prvLoads) => prvLoads - 1);

    void fetchSearchBarInfo();
    void fetchResourcesType();
  }, []);

  useEffect(() => {
    if (!resourceId) {
      setCurrentResource(null);
      return;
    }

    const fetchCurrentResource = async () => {
      setIsLoading((prvLoads) => prvLoads + 1);
      const res = await getResource(Number(resourceId));

      setIsLoading((prvLoads) => prvLoads - 1);
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

  useEffect(() => {
    const fetchResources = async () => {
      if (prevSearchParamsRef.current !== searchParams) {
        setCurrentPage(1);
        prevSearchParamsRef.current = searchParams;
      }

      setErrors([]);
      setIsLoading((prvLoads) => prvLoads + 1);

      const res = await getResources({
        ...searchParams,
        skip: (currentPage - 1) * RESOURCES_PER_PAGE,
      });

      setIsLoading((prvLoads) => prvLoads - 1);
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      recordsAvailable.current = res["@odata.count"];
      setResources(res.value);
    };

    void fetchResources();
  }, [searchParams, currentPage]);

  const userLinkedInitiatives = useMemo(
    () => [
      ...(userInitiativesAs[RoleInInitiative.LEADER] ?? []),
      ...(userInitiativesAs[RoleInInitiative.USER] ?? []),
    ],
    [userInitiativesAs],
  );

  return (
    <div className="flex flex-col gap-4 w-full *:w-full items-center bg-grey-form">
      <Header />
      {userLinkedInitiatives.length > 0 && (
        <Button asChild>
          <Link to="/Monitoreo/Recursos/Admin">Administrar mis recursos</Link>
        </Button>
      )}

      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent rounded-lg max-w-[1600px] p-4"
      />

      <div className="flex gap-2 max-w-[1600px]">
        {resourceTypes.map((resType) => (
          <Button
            key={`resTypeTrigger_${resType.id}`}
            className="flex-1"
            onClick={() => setCurrentTab(resType.id)}
          >
            {resType.name}
          </Button>
        ))}
      </div>

      {searchBarComponents && (
        <ODataSearchBar
          components={searchBarComponents}
          setSearchParams={setSearchParams}
          className="max-w-[1600px]"
          filterInjection={`resourceType/id eq ${currentTab}`}
          reset="Reiniciar consulta"
        />
      )}

      {isLoading > 0 && <LoadingDiv />}

      {currentResource && (
        <div className="max-w-[1600px] bg-primary text-background">
          {currentResource.name}
        </div>
      )}

      {resources.length > 0 ? (
        <ul>
          {resources.map((resource) => (
            <div key={resource.id}>{resource.name}</div>
          ))}
        </ul>
      ) : (
        "Todavíano hay recursos en esta categoría"
      )}

      <TablePager
        currentPage={currentPage}
        recordsAvailable={recordsAvailable.current}
        onPageChange={setCurrentPage}
        recordsPerPage={RESOURCES_PER_PAGE}
        paginated={3}
      />
    </div>
  );
}
