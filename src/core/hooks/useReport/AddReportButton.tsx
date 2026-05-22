import { ClipboardPlus } from "lucide-react";

import { useUserCTX } from "@hooks/UserContext";
import { useReport } from "@hooks/useReport";
import { Button } from "@ui/shadCN/component/button";

export function AddToReportButton({
  sectionTitle,
  sectionDescription,
  mapContainerId,
  graphContainerId,
  graphStateId = null,
  includeMap = true,
  aditionalInfo,
}: {
  sectionTitle: string;
  sectionDescription: string;
  graphContainerId: string;
  graphStateId: string | null;
  mapContainerId?: string;
  includeMap?: boolean;
  aditionalInfo?: Record<string, string>;
}) {
  const { user } = useUserCTX();
  const { addSection, isBusy } = useReport();

  return (
    <Button
      disabled={!user || isBusy}
      onClick={() =>
        void addSection(
          {
            title: sectionTitle,
            includeMap,
            description: sectionDescription,
            aditionalInfo,
          },
          graphContainerId,
          graphStateId,
          includeMap && mapContainerId ? { mapDOMId: mapContainerId } : null,
        )
      }
      title={!user ? "Inicia sesion para crear reportes" : "Añadir a reporte"}
    >
      <ClipboardPlus />
      {isBusy ? "Agregando al reporte" : "Añadir a reporte"}
    </Button>
  );
}
