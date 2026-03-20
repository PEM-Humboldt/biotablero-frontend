import { BookPlus, NotebookPen, NotebookText } from "lucide-react";

import { CreateEditTSForm } from "pages/monitoring/outlets/initiatives/territoryStories/CreateEditTSForm";
import { ReadTS } from "pages/monitoring/outlets/initiatives/territoryStories/ReadTS";
import { ManageTS } from "pages/monitoring/outlets/initiatives/territoryStories/ManageTS";
import { PanelState } from "pages/monitoring/outlets/initiatives/types/territoryStory";

export const panelView = {
  [PanelState.READ]: ReadTS,
  [PanelState.MANAGE]: ManageTS,
  [PanelState.CREATE]: CreateEditTSForm,
};

export const panelAccessButtons = new Map([
  [
    PanelState.READ,
    { label: "Leer", sr: "Ir al panel de lectura", icon: NotebookText },
  ],
  [
    PanelState.MANAGE,
    { label: "Editar", sr: "Ir al panel de administración", icon: NotebookPen },
  ],
  [
    PanelState.CREATE,
    { label: "Crear", sr: "Crear un relato", icon: BookPlus },
  ],
]);
