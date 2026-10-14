import { useCallback, useEffect, useMemo, useState } from "react";
import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import type {
  ObservationData,
  ObservationMetadata,
} from "pages/monitoring/types/observations";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import {
  getObservationData,
  getObservationsByInitiative,
} from "pages/monitoring/api/services/observations";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { LoadingDiv } from "@ui/LoadingDiv";

export function ObservationsList({
  fromInitiative,
}: {
  fromInitiative: InitiativeByLocation | null;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [observationsMetadata, setObservationsMetadata] = useState<
    ObservationMetadata[]
  >([]);
  const [versionToEdit, setVersionToEdit] = useState<ObservationData | null>(
    null,
  );

  useEffect(() => {
    if (!fromInitiative) {
      return;
    }

    const fetchObservationsMetadata = async () => {
      setErrors([]);
      setIsLoading(true);

      const res = await getObservationsByInitiative(fromInitiative.id);
      setIsLoading(false);

      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return [];
      }
      setObservationsMetadata(res);
    };

    void fetchObservationsMetadata();
  }, [fromInitiative]);

  const handleSelectVersionToEdit = useCallback(
    async (observationVersionId: number) => {
      setErrors([]);
      setIsLoading(true);
      setVersionToEdit(null);

      const res = await getObservationData(observationVersionId);
      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      setVersionToEdit(res);
    },
    [],
  );

  if (!fromInitiative) {
    return (
      <div className="p-4 bg-background rounded-lg">
        Selecciona una iniciativa para poder administrar sus observaciones
      </div>
    );
  }

  return (
    <div
      aria-label="Observaciones relacionadas"
      className="p-4 bg-background rounded-lg"
    >
      {errors.length > 0 && <ErrorsList errorItems={errors} />}

      {observationsMetadata.map((observation) =>
        observation.id !== versionToEdit?.observationId ? (
          <div key={`observationCard_${observation.id}`}>
            {observation.name} {observation.topic.name}
            las tags, el name las versiones
            {observation.versions.length}
            {observation.versions.map((version) => (
              <div key={`observation-${observation.id}_version-${version.id}`}>
                ver{" "}
                <button
                  onClick={() => void handleSelectVersionToEdit(version.id)}
                >
                  abrir
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-accent">carajo</div>
        ),
      )}
    </div>
  );
}
