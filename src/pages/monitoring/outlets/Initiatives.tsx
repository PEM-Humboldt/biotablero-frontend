import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@ui/shadCN/component/tabs";
import { useNavigate, useParams } from "react-router";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { initiativeTabs } from "pages/monitoring/outlets/initiatives/layout/tabs";
import { InitiativeError } from "pages/monitoring/outlets/initiatives/InitiativeError";
import { PageTitleUpdater } from "@ui/PageTitleUpdater";

export function Initiatives() {
  const { initiativeInfo } = useInitiativeCTX();
  const navigate = useNavigate();
  const params = useParams();

  const currentTab = params.tabSection || initiativeTabs.get("profile")?.slug;

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
      <PageTitleUpdater
        title={initiativeInfo?.shortName || initiativeInfo?.name || ""}
        subtitle={
          [...initiativeTabs.values()].find((t) => t.slug === currentTab)
            ?.label ?? ""
        }
      />

      <Tabs
        value={currentTab}
        onValueChange={(e) => void handleOnChangeTab(e)}
        className="flex flex-col h-full"
      >
        <TabsList className="w-full h-auto flex *:flex-1 bg-accent p-0! m-0!">
          {[...initiativeTabs].map(([key, value]) => (
            <TabsTrigger
              key={`tTrigger_${key}`}
              value={value.slug}
              className="text-sm lg:text-lg border-b-2 border-b-primary data-[state=active]:border-b-accent data-[state=active]:bg-primary data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-background bg-grey-light text-primary data-[state=active]:text-background justify-start p-0 cursor-pointer data-[state=active]:cursor-auto"
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
          <TabsContent
            key={`tContent_${key}`}
            value={value.slug}
            className="m-0 p-0 h-full"
          >
            <value.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
