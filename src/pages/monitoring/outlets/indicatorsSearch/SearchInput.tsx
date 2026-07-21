import type { SearchBarComponent } from "@appTypes/odata";
import { ODataSearchBar } from "@composites/ODataSearchBar";
import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import type { ODataIndicators } from "pages/monitoring/types/odataResponse";
import { useEffect, useState } from "react";
import { searchInitiativeComponents } from "pages/monitoring/outlets/indicatorsSearch/layout/searchInitiativeComponents";

export function SearchInput() {
  const { setSearchIndicators } = useIndicatorsCTX();

  return <div className="bg-accent">busque prro</div>;
}
