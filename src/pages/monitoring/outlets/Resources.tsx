import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { LoadingDiv } from "@ui/LoadingDiv";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { ODataSearchBar } from "@composites/ODataSearchBar";
import type { ODataParams, SearchBarComponent } from "@appTypes/odata";
import { TablePager } from "@composites/TablePager";
import { RESOURCES_PER_PAGE } from "@config/monitoring";
import { cn } from "@ui/shadCN/lib/utils";

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
import { makeSearchResourcesComponents } from "pages/monitoring/outlets/resources/layout/makeResourcesSearchBarComponents";
import { ResourceCard } from "pages/monitoring/outlets/resources/ResourceCard";
import { CurrentResource } from "pages/monitoring/outlets/resources/CurrentResource";

export function Resources() {
  const { resourceId } = useParams();
  const navigate = useNavigate();

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
  const resourcesAvailable = useRef(0);

  useEffect(() => {
    const fetchUIinfo = async () => {
      setIsLoading((prvLoads) => prvLoads + 1);
      const resTypes = await getResourcesType();

      if (isMonitoringAPIError(resTypes)) {
        setResourceTypes([]);
        setErrors(resTypes.data.map((err) => err.msg));
        setIsLoading((prvLoads) => prvLoads - 1);
        return;
      }

      setResourceTypes(resTypes.value);

      const resSearch = await makeSearchResourcesComponents();
      setIsLoading((prvLoads) => prvLoads - 1);

      setSearchBarComponents(resSearch);
    };

    void fetchUIinfo();
  }, []);

  const fetchCurrentResource = useCallback(async () => {
    if (!resourceId) {
      setCurrentResource(null);
      return;
    }

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
  }, [resourceId]);

  useEffect(() => {
    setResources([]);
    void fetchCurrentResource();
  }, [fetchCurrentResource]);

  useEffect(() => {
    if (!resourceTypes || !searchBarComponents) {
      return;
    }

    const fetchResources = async () => {
      if (prevSearchParamsRef.current !== searchParams) {
        setCurrentPage(1);
        prevSearchParamsRef.current = searchParams;
      }

      setResources([]);
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

      resourcesAvailable.current = res["@odata.count"];
      setResources(res.value);
    };

    void fetchResources();
  }, [searchParams, currentPage, resourceTypes, searchBarComponents]);

  const handleTabChange = (resTypeId: number) => {
    setCurrentTab(resTypeId);
    setResources([]);
    setCurrentResource(null);
    void navigate("/Monitoreo/Recursos");
  };

  const filtersInjected = useMemo(() => {
    const filters = [`resourceType/id eq ${currentTab}`];
    if (currentResource !== null) {
      filters.push(`id ne ${currentResource.id}`);
    }
    return filters.join(" and ");
  }, [currentResource, currentTab]);

  const plural = resourcesAvailable.current !== 1 ? "s " : " ";

  return (
    <div className="flex flex-col gap-4 lg:gap-6 pb-8 w-full items-center bg-grey-form">
      <Header />

      <ErrorsList
        errorItems={errors}
        className="w-1/2 min-w-[300px] mx-12 p-4 bg-accent/10 border border-accent rounded-lg"
      />

      <div className="flex flex-wrap gap-4 w-full max-w-[1600px] px-4">
        {resourceTypes.map((resType) => (
          <div
            key={`resTypeTrigger_${resType.id}`}
            className={cn(
              "isolate relative flex-[1_1_200px] flex flex-col p-4 lg:p-6 border-2 border-transparent rounded-xl shadow-xl transition-all duration-200",
              resType.id === currentTab
                ? "bg-primary text-primary-foreground"
                : "hover:bg-primary/10 hover:shadow hover:scale-107 hover:border-primary",
            )}
          >
            <h3 className="text-4xl font-bold text-balance">{resType.name}</h3>

            <p className="text-pretty m-0">{resType.description}</p>

            {resType.id !== currentTab && (
              <button
                onClick={() => handleTabChange(resType.id)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                aria-label={`Seleccionar tipo de recurso: ${resType.name}`}
              />
            )}
          </div>
        ))}
      </div>

      {searchBarComponents && (
        <div className="w-full px-4 max-w-[1200px] flex flex-col items-center">
          <ODataSearchBar
            components={searchBarComponents}
            setSearchParams={setSearchParams}
            className="w-full bg-muted [&_select]:bg-background flex-wrap! py-2"
            filterInjection={filtersInjected}
            reset="Reiniciar consulta"
          />
          <div className="text-primary text-left w-full mb-0 px-6">
            <strong>{resourcesAvailable.current} </strong>
            Recurso{plural}encontrado{plural}
          </div>
        </div>
      )}

      {isLoading > 0 && (
        <LoadingDiv className="bg-transparent border-none text-center" />
      )}

      <CurrentResource
        resource={currentResource}
        updateResource={fetchCurrentResource}
      />

      {resources.length > 0 ? (
        <section className="w-full max-w-[1600px]">
          <h3 className="sr-only">Recursos disponibles</h3>
          <ul className="px-4 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </ul>
        </section>
      ) : (
        "Todavíano hay recursos en esta categoría"
      )}

      <TablePager
        currentPage={currentPage}
        recordsAvailable={resourcesAvailable.current}
        onPageChange={setCurrentPage}
        recordsPerPage={RESOURCES_PER_PAGE}
        paginated={3}
      />
    </div>
  );
}
