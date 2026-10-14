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

export function ObservationsAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [initiatives, setInitiatives] = useState<InitiativeByLocation[]>([]);
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
    <div>
      {initiatives.map((initiative) => (
        <div key={initiative.id}>
          <h4>{initiative.name}</h4>
          {initiative.mainLocationId}
          <button
            onClick={() => {
              setCurrentInitiative(initiative);
            }}
          >
            poncheme {initiative.name}
          </button>
        </div>
      ))}

      {renderObservations.map((observation) => (
        <div key={observation.id}>
          {observation.name} {observation.topic.name}
          las tags, el name las versiones {observation.versions.length}
          {observation.versions.map((version) => (
            <div key={`observation-${observation.id}_version-${version.id}`}>
              ver{" "}
              <button onClick={() => void fetchObservationData(version.id)}>
                abrir
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
