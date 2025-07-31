import React, { useState } from "react";
import { Carrousel } from "pages/home/Carrousel";
import { TabsModules } from "pages/home/TabsComponent";
import "newStyles.css";
import "headerFooter.css";

type HomeProps = { referrer: string };

export function Home({ referrer }: HomeProps) {
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [showWhatIs, setShowWhatIs] = useState<boolean>(true);

  return (
    <div>
      <Carrousel {...{ setActiveTab, setShowWhatIs }} />
      <TabsModules {...{ activeTab, setActiveTab }} />
    </div>
  );
}
