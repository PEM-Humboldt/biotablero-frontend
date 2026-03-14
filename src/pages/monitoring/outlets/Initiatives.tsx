import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@ui/shadCN/component/tabs";
import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { InitiativeSelector_NOT_FOR_PRODUCTION } from "pages/monitoring/outlets/initiatives/Selector";
import { useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { initiativeTabs } from "pages/monitoring/outlets/initiatives/layout/tabs";
import { InitiativeError } from "./initiatives/InitiativeError";

export function Initiatives() {
  const { layoutDispatch } = useOutletContext<UiManager>();
  const { initiativeInfo } = useInitiativeCTX();
  const navigate = useNavigate();
  const params = useParams();

  const currentTab = params.tabSection || initiativeTabs.get("profile")?.slug;

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.HEADER_NAMES,

      newHeader: {
        title: initiativeInfo?.name ?? "",
        subtitle: "",
      },
    });
  }, [layoutDispatch, initiativeInfo]);

  const handleOnChangeTab = async (tabSlug: string) => {
    await navigate(
      !initiativeInfo
        ? `/Monitoreo/Iniciativas/`
        : `/Monitoreo/Iniciativas/${initiativeInfo?.id}/${tabSlug}`,
    );
  };

  if (!initiativeInfo && params.initiativeId) {
    return (
      <InitiativeError msg="La iniciativa que buscas ya no se encuentra en este enlace" />
    );
  }

  return (
    <div className="flex flex-col w-full">
      <InitiativeSelector_NOT_FOR_PRODUCTION />
      {!initiativeInfo ? (
        <h1>Acá iría un buscador muy nais</h1>
      ) : (
        // TODO: El contexto debe tomar el id de la iniciativa de la url
        <Tabs
          value={currentTab}
          onValueChange={(e) => void handleOnChangeTab(e)}
        >
          <TabsList className="w-full h-auto flex *:flex-1 bg-accent p-0! m-0!">
            {[...initiativeTabs].map(([key, value]) => (
              <TabsTrigger
                key={`tTrigger_${key}`}
                value={value.slug}
                className="text-lg border-b-2 border-b-primary data-[state=active]:border-b-accent data-[state=active]:bg-primary data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-background bg-grey-light text-primary data-[state=active]:text-background justify-start p-0 cursor-pointer data-[state=active]:cursor-auto"
              >
                <value.icon
                  className="bg-primary/20 p-2 mr-2 size-9 "
                  aria-hidden="true"
                />
                {value.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {[...initiativeTabs].map(([key, value]) => (
            <TabsContent key={`tContent_${key}`} value={value.slug}>
              <value.component />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
