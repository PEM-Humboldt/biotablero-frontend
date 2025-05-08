import React, { useState } from "react";
import Carrousel from "pages/home/Carrousel";
import Tabsmodulos from "pages/home/tabsComponent";

import "newStyles.css";
import "headerFooter.css";


const Inicio = ({ referrer }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [showQueEs, setShowQueEs] = useState(true); 

    return (
  

        <div>
            <Carrousel setActiveTab={setActiveTab} setShowQueEs={setShowQueEs} />
            <Tabsmodulos activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
     

    );
}

export default Inicio;
