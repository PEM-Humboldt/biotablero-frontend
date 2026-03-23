import { useTerritoryStorysCTX } from "pages/monitoring/hooks/useTerritoryStorysCTX";
import { CreateEditTSForm } from "pages/monitoring/outlets/initiatives/territoryStories/CreateEditTSForm";
import {
  PanelState,
  type PanelComponentProp,
} from "pages/monitoring/outlets/initiatives/types/territoryStory";

export function CreateTS({ moveToPanel }: PanelComponentProp) {
  const { updateStorys } = useTerritoryStorysCTX();
  // TODO: Cuando esté el panel de visualización listo,
  // redirigir a la historia publicada
  return (
    <CreateEditTSForm
      onEditSuccess={() => {
        if (!moveToPanel) {
          return;
        }
        moveToPanel(PanelState.READ);
        void updateStorys();
      }}
    />
  );
}
