import React, { useState } from "react";
import Carrousel from "pages/home/Carrousel";
import Tabsmodulos from "pages/home/TabsComponent";
import "newStyles.css";
import "headerFooter.css";

type HomeProps = { referrer: string };

export const Home: React.FC<HomeProps> = ({ referrer }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showWhatIs, setShowWhatIs] = useState<boolean>(true);

  return (
    <div>
      <Carrousel setActiveTab={setActiveTab} setShowQueEs={setShowWhatIs} />
      <Tabsmodulos activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
