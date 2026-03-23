import { BookPlus, NotebookPen, NotebookText } from "lucide-react";

import { ReadTS } from "pages/monitoring/outlets/initiatives/territoryStories/ReadTS";
import { ManageTS } from "pages/monitoring/outlets/initiatives/territoryStories/ManageTS";
import { PanelState } from "pages/monitoring/outlets/initiatives/types/territoryStory";
import { CreateTS } from "pages/monitoring/outlets/initiatives/territoryStories/CreateTS";

export const panelView = {
  [PanelState.READ]: ReadTS,
  [PanelState.MANAGE]: ManageTS,
  [PanelState.CREATE]: CreateTS,
};

export const panelAccessButtons = new Map([
  [
    PanelState.READ,
    {
      label: "Leer",
      title: "Ir al panel de lectura",
      sr: "Ir al panel de lectura",
      icon: NotebookText,
    },
  ],
  [
    PanelState.MANAGE,
    {
      label: "Editar",
      title: "Ir al panel de administración",
      sr: "Ir al panel de administración",
      icon: NotebookPen,
    },
  ],
  [
    PanelState.CREATE,
    {
      label: "Crear",
      title: "Crear un relato",
      sr: "Crear un relato",
      icon: BookPlus,
    },
  ],
]);
