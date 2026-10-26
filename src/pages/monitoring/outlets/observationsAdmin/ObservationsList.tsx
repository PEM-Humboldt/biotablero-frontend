import { useCallback, useEffect, useState } from "react";
import type { InitiativeByLocation } from "pages/monitoring/types/initiative";
import {
  type ObservationData,
  type ObservationMetadata,
} from "pages/monitoring/types/observations";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import {
  getObservationData,
  getObservationMetadata,
  getObservationsByInitiative,
} from "pages/monitoring/api/services/observations";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { LoadingDiv } from "@ui/LoadingDiv";
import { Button } from "@ui/shadCN/component/button";
import { ScanSearch } from "lucide-react";
import { cn } from "@ui/shadCN/lib/utils";
import { motion } from "motion/react";
import { ObservationVersionCard } from "pages/monitoring/outlets/observationsAdmin//observationsList/ObservationVersionCard";
import { ObservationHeader } from "pages/monitoring/outlets/observationsAdmin/observationsList/ObservationHeader";
import { uiText } from "pages/monitoring/outlets/observationsAdmin/layout/uiText";

export function ObservationsList({
  fromInitiative,
}: {
  fromInitiative: InitiativeByLocation | null;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [editObservation, setEditObservation] = useState<number | null>(null);
  const [observationsMetadata, setObservationsMetadata] = useState<
    ObservationMetadata[]
  >([]);
  const [selectedObservationVersion, setSelectedObservationVersion] =
    useState<ObservationData | null>(null);

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

  const handleGetVersion = useCallback(async (observationVersionId: number) => {
    setErrors([]);
    setIsLoading(true);

    const res = await getObservationData(observationVersionId);
    setIsLoading(false);
    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      setSelectedObservationVersion(null);
      return;
    }

    setSelectedObservationVersion(res);
  }, []);

  const updateObservationMetadata = async (observationId: number) => {
    setIsLoading(true);
    setErrors([]);

    const updatedObservation = await getObservationMetadata(observationId);
    setIsLoading(false);
    if (isMonitoringAPIError(updatedObservation)) {
      setErrors(updatedObservation.data.map((err) => err.msg));
      return;
    }

    setObservationsMetadata((oldObservations) => {
      const newObservations = oldObservations.map((oldObservation) =>
        oldObservation.id === updatedObservation.id
          ? updatedObservation
          : oldObservation,
      );
      return newObservations;
    });
  };

  const handleSetObservationToEdit = useCallback(
    (observationId: number | null) => {
      setEditObservation(observationId);

      if (
        observationId !== null &&
        selectedObservationVersion &&
        selectedObservationVersion.observationId !== observationId
      ) {
        setSelectedObservationVersion(null);
      }
    },
    [selectedObservationVersion],
  );

  return (
    <>
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 p-4 border border-accent rounded-lg"
      />

      {isLoading && (
        <LoadingDiv
          text={uiText.observationsList.loadind}
          className="absolute"
        />
      )}

      <ul
        aria-label={uiText.observationsList.listDescription.sr}
        className="space-y-4"
      >
        {observationsMetadata.map((observation) => {
          const isEditModeOn = observation.id === editObservation;

          return (
            <motion.li
              key={`observationCard_${observation.id}`}
              layout
              transition={{
                layout: { type: "spring", stiffness: 350, damping: 25 },
              }}
              className={cn(
                "relative border border-muted rounded-lg p-4 overflow-hidden",
                isEditModeOn ? "shadow-xl border-primary" : "",
              )}
            >
              <motion.div layout="position" className="flex flex-col gap-2">
                <Button
                  onClick={() =>
                    handleSetObservationToEdit(
                      isEditModeOn ? null : observation.id,
                    )
                  }
                  className="ml-auto"
                >
                  {isEditModeOn
                    ? "cerrar el modo de edición"
                    : "Iniciar el modo de edición"}
                </Button>

                <ObservationHeader
                  observation={observation}
                  editMode={isEditModeOn}
                  onUpdateSuccess={() =>
                    updateObservationMetadata(observation.id)
                  }
                />

                <div
                  aria-label={
                    uiText.observationsList.versionsListDescription.sr
                  }
                >
                  {isEditModeOn
                    ? uiText.observationsList.versionsListDescriptionEdit.label
                    : uiText.observationsList.versionsListDescription.label}

                  <ul className="border-t border-t-muted py-2 flex flex-wrap gap-2">
                    {observation.versions.map((version) => {
                      const isThisVersionSelected =
                        version.id === selectedObservationVersion?.id;

                      return (
                        <li
                          key={`observation-${observation.id}_version-${version.id}`}
                        >
                          <Button
                            onClick={() =>
                              isThisVersionSelected
                                ? setSelectedObservationVersion(null)
                                : void handleGetVersion(version.id)
                            }
                            variant={
                              isThisVersionSelected ? "default" : "outline"
                            }
                            title={uiText.observationsList.openVersionBtn.sr(
                              version.version,
                              new Date(version.creationDate),
                            )}
                            aria-label={uiText.observationsList.openVersionBtn.sr(
                              version.version,
                              new Date(version.creationDate),
                            )}
                          >
                            <ScanSearch className="size-6" />
                            {uiText.observationsList.openVersionBtn.label(
                              version.version,
                              new Date(version.creationDate),
                            )}
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {selectedObservationVersion &&
                  selectedObservationVersion.observationId ===
                    observation.id && (
                    <>
                      <ObservationVersionCard
                        observationData={selectedObservationVersion}
                        editingThis={isEditModeOn}
                        onUpdateSuccess={() =>
                          handleGetVersion(selectedObservationVersion.id)
                        }
                      />

                      {isEditModeOn && (
                        <Button
                          onClick={() => handleSetObservationToEdit(null)}
                          className="ml-auto"
                        >
                          {"cerrar el modo de edición"}
                        </Button>
                      )}
                    </>
                  )}
              </motion.div>
            </motion.li>
          );
        })}
      </ul>
    </>
  );
}
