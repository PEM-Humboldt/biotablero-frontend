import React, { useState } from "react";
import Carrousel from "./home/Carrousel";
import Tabsmodulos from "./home/TabsComponent";
import Header from "../app/layout/Header"; 
import Footer from "../app/layout/Footer"; 
import "../estilosNuevos.css";
import "../Headerfooter.css";


interface InicioProps {
  referrer: string;
}

const Inicio: React.FC<InicioProps> = ({ referrer }) => {
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
