import React, { useState } from "react";

import AlertDescriptions from "pages/home/information/Alerts";
import CompensationDescriptions from "pages/home/information/Compensations";
import IndicatorDescriptions from "pages/home/information/Indicators";
import PortfolioDescriptions from "pages/home/information/Portfolio";
import SearchDescriptions from "pages/home/information/Searches";
import CbmdDescriptions from "pages/home/information/Cbmd";

import { BasicTitleTypes } from "pages/home/types/informationTypes";

interface InformationTypes {
  activeModule: string;
}

type Keys = "queEs" | "porque" | "quienProduce" | "queEncuentras";

interface ContentInfoTypes {
  [key: string]: BasicTitleTypes;
}

const Information: React.FC<InformationTypes> = ({ activeModule }) => {
  const [activeItem, setActiveItem] = useState<string>("queEs");

  const contentInfo: ContentInfoTypes = {
    search: SearchDescriptions,
    indicator: IndicatorDescriptions,
    portfolio: PortfolioDescriptions,
    compensation: CompensationDescriptions,
    alert: AlertDescriptions,
    cbmdashboard: CbmdDescriptions,
  };

  const { title, description } = contentInfo[activeModule]
    ? contentInfo[activeModule][activeItem as Keys]
    : { title: "", description: "" };

  return (
    <div className="menuline">
      <menu>
        <button
          type="button"
          className={`btnhome btn1 ${activeItem === "queEs" ? "active" : ""}`}
          onClick={() => setActiveItem("queEs")}
        >
          <b>01</b>
          {" ¿Qué es?"}
        </button>
        <button
          type="button"
          className={`btnhome btn2 ${activeItem === "porque" ? "active" : ""}`}
          onClick={() => setActiveItem("porque")}
        >
          <b>02</b>
          {" ¿Por qué?"}
        </button>
        <button
          type="button"
          className={`btnhome btn3 ${
            activeItem === "quienProduce" ? "active" : ""
          }`}
          onClick={() => setActiveItem("quienProduce")}
        >
          <b>03</b>
          {" ¿Quién produce?"}
        </button>
        <button
          type="button"
          className={`btnhome btn4 ${
            activeItem === "queEncuentras" ? "active" : ""
          }`}
          onClick={() => setActiveItem("queEncuentras")}
        >
          <b>04</b>
          {" ¿Qué encuentras?"}
        </button>
      </menu>
      <div className={`${activeModule}`}>
        <div className={`content ${activeItem}`}>
          <h1>{title}</h1>
          {description}
        </div>
      </div>
    </div>
  );
};

export default Information;
