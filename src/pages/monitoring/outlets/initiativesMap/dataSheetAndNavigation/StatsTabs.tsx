import { useState } from "react";

import { Tabs, TabsList } from "@ui/shadCN/component/tabs";

import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import type { StatsType } from "pages/monitoring/types/stats";
import { cn } from "@ui/shadCN/lib/utils";
import {
  tabsAvailable,
  statsTabsInfo,
} from "pages/monitoring/outlets/initiativesMap/layout/statsTabsInfo";

export function StatsTabs() {
  const [currentTab, setCurrentTab] = useState<StatsType>(tabsAvailable[0]);

  return (
    <Tabs
      onValueChange={(t) => setCurrentTab(t as StatsType)}
      value={currentTab}
    >
      <TabsList className="gap-1 my-2 mx-1 hover:outline-primary/80 transition-colors duration-300 outline-offset-0 rounded-lg bg-transparent">
        {tabsAvailable.map((tab) => {
          const btnInfo = statsTabsInfo[tab].tabBtn;
          const Icon = btnInfo.icon;

          return (
            <TabsTrigger key={`statsTrigger_${tab}`} value={tab} asChild>
              <button
                className={cn(
                  "flex flex-col flex-1 text-balance gap-1 p-2 items-center rounded-lg text-sm/4 font-normal transition-color duration-300",
                  currentTab === tab
                    ? "bg-accent text-accent-foreground shadow-2xl"
                    : "hover:text-primary-foreground hover:bg-primary hover:cursor-pointer [&_svg]:text-accent hover:[&_svg]:text-primary-foreground",
                )}
                title={btnInfo.title}
                aria-label={btnInfo.sr}
              >
                <Icon
                  className={cn("size-6")}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                {btnInfo.label}
              </button>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {tabsAvailable.map((tab) => {
        const Stats = statsTabsInfo[tab].component;
        return (
          <TabsContent
            key={`statsContent${tab}`}
            value={tab}
            className="max-h-80 lg:max-h-none overflow-y-auto scrollbar-custom"
          >
            {Stats && <Stats />}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
