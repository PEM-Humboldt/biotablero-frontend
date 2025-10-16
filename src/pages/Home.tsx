import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { Carrousel } from "pages/home/Carrousel";
import { TabsModules } from "pages/home/TabsComponent";

import "pages/home/layout/newStyles.css";

export function Home() {
  const { layoutDispatch } = useOutletContext<UiManager>();
  const [activeTab, setActiveTab] = useState<number | null>(0);

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
    <div>
      <Carrousel setActiveTab={setActiveTab} />
      <TabsModules activeTab={activeTab} />
    </div>
  );
}
