import { useState } from "react";
import {
  type ObservationData,
  type ObservationMetadata,
} from "pages/monitoring/types/observations";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import { LOCALE } from "@config/global";
import { FilePenLine } from "lucide-react";
import { motion } from "motion/react";

export function ObservationVersionCard({
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
