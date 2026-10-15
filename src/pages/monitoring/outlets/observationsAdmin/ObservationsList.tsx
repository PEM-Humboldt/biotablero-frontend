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
import { Button } from "@ui/shadCN/component/button";
import { TagsGroupsRender } from "pages/monitoring/ui/TagsGroupsRender";
import { LOCALE } from "@config/global";
import { FilePenLine, ScanSearch } from "lucide-react";
import { cn } from "@ui/shadCN/lib/utils";
import { motion, AnimatePresence } from "motion/react";

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
  const [observationVersion, setObservationVersion] =
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

  const handleSelectVersion = useCallback(
    async (observationVersionId: number) => {
      setErrors([]);
      setIsLoading(true);
      setObservationVersion(null);

      const res = await getObservationData(observationVersionId);
      setIsLoading(false);
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      setObservationVersion(res);
    },
    [],
  );

  return !fromInitiative ? (
    <div className="p-4 bg-background rounded-lg">
      Selecciona una iniciativa para poder administrar sus observaciones
    </div>
  ) : (
    <div className="p-4 bg-background rounded-lg space-y-4">
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 p-4 border border-accent rounded-lg"
      />

      {isLoading && (
        <LoadingDiv
          text="Cargando información de las observaciones..."
          className="absolute"
        />
      )}

      <ul aria-label="Observaciones relacionadas" className="space-y-4">
        {observationsMetadata.map((observation) => {
          const isSelected =
            observationVersion &&
            observationVersion.observationId === observation.id;

          return (
            <motion.li
              key={`observationCard_${observation.id}`}
              layout
              transition={{
                layout: { type: "spring", stiffness: 350, damping: 25 },
              }}
              className={cn(
                "border border-muted rounded-lg p-4 overflow-hidden",
                isSelected ? "shadow-xl border-primary" : "",
              )}
            >
              <motion.div layout="position" className="space-y-3">
                <h4 className="*:block">
                  <span>{observation.name}</span>
                  <span className="text-base italic font-light">
                    {observation.topic.name}
                  </span>
                </h4>

                <TagsGroupsRender
                  tags={observation.tags.map((t) => t.tag)}
                  groupId={observation.name.replaceAll(" ", "")}
                  colorIndexOffset={3}
                />

                <div>
                  Versiones
                  <ul className="border-t border-t-muted py-2 flex flex-wrap gap-2">
                    {observation.versions.map((version) => {
                      const observationDate = new Date(version.creationDate);
                      return (
                        <li
                          key={`observation-${observation.id}_version-${version.id}`}
                        >
                          <Button
                            onClick={() => void handleSelectVersion(version.id)}
                            variant={isSelected ? "default" : "outline"}
                            title={`Ver la version ${version.version} de ${observationDate.toLocaleDateString(LOCALE)}`}
                            disabled={version.id === observationVersion?.id}
                          >
                            <ScanSearch className="size-6" />
                            {observationDate.toLocaleDateString(LOCALE)}
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {isSelected && (
                  <ObservationVersionCard
                    observationMetadata={observation}
                    observationData={observationVersion}
                  />
                )}
              </motion.div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function ObservationVersionCard({
  observationMetadata,
  observationData,
}: {
  observationMetadata: ObservationMetadata;
  observationData: ObservationData;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-input min-h-60"
    >
      <ErrorsList errorItems={errors} />

      {observationData.observationId}
      <Button
        onClick={() => setIsEditing((isEditing) => !isEditing)}
        title={`Editar la version ${observationData.version} de ${new Date(observationData.creationDate).toLocaleDateString(LOCALE)}`}
      >
        <FilePenLine />
      </Button>
    </motion.div>
  );
}
