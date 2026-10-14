import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  InitiativeByLocation,
  InitiativeDisplayInfoShort,
} from "pages/monitoring/types/initiative";
import type {
  ObservationData,
  ObservationMetadata,
} from "pages/monitoring/types/observations";
import {
  getInitiativeLocations,
  getInitiatives,
} from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import {
  getObservationData,
  getObservationsByInitiative,
} from "../api/services/observations";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import { PageTitleUpdater } from "@ui/PageTitleUpdater";
import { cn } from "@ui/shadCN/lib/utils";
import { makeInitiativeLocationsString } from "@utils/format";
import {
  ChevronRightCircle,
  RotateCcw,
  SearchIcon,
  XCircle,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { fuzzySearch } from "../utils/search";
import { StrValidator } from "@utils/strValidator";
import { InitiativesSearch } from "./observationsAdmin/InitiativesSearch";

export function ObservationsAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [initiatives, setInitiatives] = useState<InitiativeByLocation[]>([]);
  const [initiativesFilterInput, setInitiativesFilterInput] = useState("");
  const [currentInitiative, setCurrentInitiative] =
    useState<InitiativeByLocation | null>(null);
  const [observationsMetadata, setObservationsMetadata] = useState<
    Map<number, ObservationMetadata[]>
  >(new Map());
  const [observationsData, setObservationsData] =
    useState<ObservationData | null>(null);

  useEffect(() => {
    const fetchInitiativesAvailable = async () => {
      const res = await getInitiativeLocations();
      setIsLoading(false);

      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      setInitiatives(res);
    };

    void fetchInitiativesAvailable();
  }, []);

  useEffect(() => {
    if (!currentInitiative || observationsMetadata.has(currentInitiative.id)) {
      return;
    }

    const fetchIndicatorsFromInitiative = async () => {
      setErrors([]);
      setIsLoading(true);

      const res = await getObservationsByInitiative(currentInitiative.id);
      setIsLoading(false);

      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));

        return [];
      }

      setObservationsMetadata((oldObservations) => {
        const newObservations = new Map(oldObservations);
        newObservations.set(currentInitiative.id, res);

        return newObservations;
      });

      return res;
    };

    void fetchIndicatorsFromInitiative();
  }, [observationsMetadata, currentInitiative]);

  const fetchObservationData = async (observationVersionId: number) => {
    setErrors([]);
    setIsLoading(true);
    const res = await getObservationData(observationVersionId);
    setIsLoading(false);
    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      return;
    }
  };

  const renderObservations = useMemo(() => {
    if (!currentInitiative) {
      return [];
    }
    return observationsMetadata.get(currentInitiative.id) ?? [];
  }, [currentInitiative, observationsMetadata]);

  return (
    <main className="page-main">
      <PageTitleUpdater title="Administrar Observaciones" subtitle="" />

      <header>
        <h3>Administrar Observaciones</h3>
        <Button>Cargar Observaciones</Button>
      </header>

      {errors.length > 0 && <ErrorsList errorItems={errors} />}

      <div className="w-full grid grid-cols-1 md:grid-cols-[30%_70%] gap-4">
        <InitiativesSearch
          initiatives={initiatives}
          currentInitiative={currentInitiative}
          setCurrentInitiative={setCurrentInitiative}
        />

        <div>
          <h4>Observaciones relacionadas</h4>
          {renderObservations.map((observation) => (
            <div key={observation.id}>
              {observation.name} {observation.topic.name}
              las tags, el name las versiones {observation.versions.length}
              {observation.versions.map((version) => (
                <div
                  key={`observation-${observation.id}_version-${version.id}`}
                >
                  ver{" "}
                  <button onClick={() => void fetchObservationData(version.id)}>
                    abrir
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
