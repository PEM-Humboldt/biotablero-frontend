import { ClipboardPlus, FileCheck } from "lucide-react";

import { useUserCTX } from "@hooks/UserContext";
import { useReport } from "@hooks/useReport";
import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

export function AddToReportButton({
  sectionId,
  sectionTitle,
  sectionDescription,
  graphElement,
  graphStateId = null,
  mapContainerId,
  aditionalInfo,
}: {
  sectionId: string;
  sectionTitle: string;
  sectionDescription: string;
  graphElement: React.ReactElement;
  graphStateId: string | null;
  mapContainerId: string | null;
  aditionalInfo?: Record<string, string>;
}) {
  const { user } = useUserCTX();
  const { addSection, isBusy, openReportInNewTab, documentSections } =
    useReport();

  return (
    <ButtonGroup>
      <Button
        disabled={!user || isBusy}
        onClick={() =>
          void addSection(
            sectionId,
            {
              title: sectionTitle,
              description: sectionDescription,
              graphInfo: aditionalInfo,
            },
            graphElement,
            graphStateId,
            mapContainerId ?? null,
          )
        }
        title={!user ? "Inicia sesion para crear reportes" : "Añadir a reporte"}
      >
        <ClipboardPlus />
        {isBusy ? "Agregando al reporte" : "Añadir a reporte"}
      </Button>
      {documentSections.size > 0 && (
        <Button
          disabled={!user || isBusy}
          onClick={() => void openReportInNewTab()}
        >
          <FileCheck />
          ver reporte
        </Button>
      )}
    </ButtonGroup>
  );
}
