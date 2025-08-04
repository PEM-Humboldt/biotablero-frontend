import { useState } from "react";
import { Carrousel } from "pages/home/Carrousel";
import { TabsModules } from "pages/home/TabsComponent";
import "newStyles.css";
import "headerFooter.css";

export const Home = () => {
  const [activeTab, setActiveTab] = useState<number | null>(0);

  return (
    <div>
      <Carrousel setActiveTab={setActiveTab} />
      <TabsModules activeTab={activeTab} />
    </div>
  );
};
