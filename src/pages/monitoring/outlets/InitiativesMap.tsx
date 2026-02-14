import { ChangeEvent, useEffect, useState } from "react";

import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";
import {
  getInitiatives,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import type { ODataInitiative } from "pages/monitoring/types/odataResponse";
import { JoinInitiativeRequestButton } from "pages/monitoring/ui/JoinInitiativeRequestButton";

import { SearchBar } from "pages/monitoring/outlets/initiativesMap/SearchBar";
import { Browser } from "pages/monitoring/outlets/initiativesMap/Browser";
import "pages/monitoring/styles/monitoring.css";
import { MapFinder } from "pages/monitoring/outlets/initiativesMap/MapFinder";

export function InitiativesMap() {
  // NOTE: Esto es para poder probar el botón de solicitud de ingreso,
  // el llamado de iniciativas para el buscador corresponde a
  // otro ticket y será manejado mejor
  const [allInitiatives, setAllInitiatives] = useState<
    ODataInitiative["value"]
  >([]);
  const [currentInitiative, setCurrentInitiative] = useState<number>(0);
  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        const initiatives = await getInitiatives({ orderby: "id desc" });
        if (isMonitoringAPIError(initiatives)) {
          console.error(initiatives.message);
        }
        setAllInitiatives(initiatives.value);
      } catch (err) {
        console.error(err);
      }
    };
    void fetchInitiatives();
  }, []);
  const handleInitiativeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentInitiative(Number(e.target.value));
  };

  return (
    <>
      <SearchBar />

      <Browser title="" subtitle="">
        <div className="p-4">
          <NativeSelect onChange={handleInitiativeChange}>
            <NativeSelectOption value={0}>
              Selecciona una iniciativa
            </NativeSelectOption>
            {allInitiatives.map((initiative) => (
              <NativeSelectOption key={initiative.id} value={initiative.id}>
                nombre:{initiative.name} id:{initiative.id}
              </NativeSelectOption>
            ))}
          </NativeSelect>

          <JoinInitiativeRequestButton initiativeId={currentInitiative} />
        </div>
      </Browser>

      <div className="flex h-full">
        <MapFinder />
      </div>
    </>
  );
}
