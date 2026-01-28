import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { ModulesCarousel } from "pages/home/Carousel";
import { ModulesTabs } from "pages/home/TabsComponent";

export function Home() {
  const { layoutDispatch } = useOutletContext<UiManager>();
  const [activeTab, setActiveTab] = useState<number | null>(null);

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleName: "",
        logos: new Set(["nasa", "temple", "siac"]),
        className: "",
      },
    });
  }, [layoutDispatch]);

  return (
    <div className="bg-grey-light h-full">
      <ModulesCarousel activeTab={activeTab} setActiveTab={setActiveTab} />
      <ModulesTabs activeTab={activeTab} />
    </div>
  );
}
