import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { Carrousel } from "pages/home/Carrousel";
import { TabsModules } from "pages/home/TabsComponent";
import type { UiManager } from "app/Layout";
import { UpdatedLayout } from "app/layout/layoutReducer";

import "newStyles.css";
import "headerFooter.css";

export function Home() {
  const { layoutDispatch } = useOutletContext<UiManager>();
  const [activeTab, setActiveTab] = useState<number | null>(0);

  useEffect(() => {
    layoutDispatch({
      type: UpdatedLayout.SECTION,
      sectionData: {
        moduleName: "",
        logos: new Set(["usaid", "geobon", "umed", "temple"]),
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
