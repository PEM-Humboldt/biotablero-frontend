import { ODataParams } from "@appTypes/odata";
import { ODataSearchBar } from "@composites/ODataSearchBar";
import { MapFinder } from "pages/monitoring/outlets/initiativesMap/MapFinder";
import { CurrentInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { searchBarItems } from "pages/monitoring/outlets/initiativesMap/layout/searchBarContent";
import { useState } from "react";
import { Browser } from "pages/monitoring/outlets/initiativesMap/Browser";

export function InitiativesMap() {
  const [searchParams, setSearchParams] = useState<ODataParams>({});

  return (
    <CurrentInitiativeCTX>
      <div className="relative flex flex-col h-full w-full">
        <ODataSearchBar
          components={searchBarItems}
          setSearchParams={setSearchParams}
          reset={"reset"}
          className="bg-background w-full px-16"
        />
        <Browser />
        <MapFinder />
      </div>
    </CurrentInitiativeCTX>
  );
}
