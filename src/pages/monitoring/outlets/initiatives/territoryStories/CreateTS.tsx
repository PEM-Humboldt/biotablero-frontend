import { useTerritoryStoriesCTX } from "pages/monitoring/hooks/useTerritoryStoriesCTX";
import { CreateEditTSForm } from "pages/monitoring/outlets/initiatives/territoryStories/ui/CreateEditTSForm";
import {
  PanelState,
  type PanelComponentProp,
} from "pages/monitoring/outlets/initiatives/types/territoryStory";

export function CreateTS({ moveToPanel }: PanelComponentProp) {
  const { updateStories } = useTerritoryStoriesCTX();
  // TODO: Cuando esté el panel de visualización listo,
  // redirigir a la historia publicada
  return (
    <CreateEditTSForm
      onEditSuccess={() => {
        if (!moveToPanel) {
          return;
        }
        moveToPanel(PanelState.READ);
        void updateStories();
      }}
    />
  );
}
