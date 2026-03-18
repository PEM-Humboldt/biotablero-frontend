import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { FormTS } from "pages/monitoring/outlets/initiatives/territoryStorys/FormTS";
import { useEffect, useState } from "react";
import { Button } from "@ui/shadCN/component/button";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { BookPlus, NotebookPen, NotebookText } from "lucide-react";
import { cn } from "@ui/shadCN/lib/utils";

enum PanelState {
  CREATE = "create",
  READ = "read",
  MANAGE = "manage",
}

export function TerritoryStorys() {
  const { userStateInInitiative } = useInitiativeCTX();
  const [panel, setPanel] = useState<PanelState>(PanelState.READ);

  useEffect(() => {
    if (
      userStateInInitiative !== UserStateInInitiative.USER_LEADER &&
      userStateInInitiative !== UserStateInInitiative.USER_PARTICIPANT
    ) {
      setPanel(PanelState.READ);
    }

    return () => {
      setPanel(PanelState.READ);
    };
  }, [userStateInInitiative]);

  const views = {
    [PanelState.READ]: <div>lea papito</div>,
    [PanelState.CREATE]: <FormTS />,
    [PanelState.MANAGE]: <div>edita quedita</div>,
  };

  return (
    <div className="flex flex-col items-center">
      <header className="justify-end p-4 bg-grey w-full">Imagen del RT</header>
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] w-full max-w-[1600px]">
        <main>
          <div className="bg-primary p-4 pl-8 ">busqueda</div>
          <div className={cn(panel !== PanelState.READ ? "bg-[#f5f5f5]" : "")}>
            <ToggleTSAdminActions currentPanel={panel} goToPanel={setPanel} />

            {views[panel]}
          </div>
        </main>
        <aside className="bg-accent">barra lateral</aside>
      </div>
    </div>
  );
}

function ToggleTSAdminActions({
  currentPanel,
  goToPanel,
}: {
  currentPanel: PanelState;
  goToPanel: (newPanel: PanelState) => void;
}) {
  const { userStateInInitiative } = useInitiativeCTX();

  if (
    userStateInInitiative !== UserStateInInitiative.USER_LEADER &&
    userStateInInitiative !== UserStateInInitiative.USER_PARTICIPANT
  ) {
    return null;
  }

  const allPanels = new Map([
    [
      PanelState.READ,
      {
        label: "Leer",
        sr: "Volver al modo lectura",
        icon: NotebookText,
      },
    ],
    [
      PanelState.MANAGE,
      {
        label: "Editar",
        sr: "Ir al panel de administración",
        icon: NotebookPen,
      },
    ],
    [
      PanelState.CREATE,
      {
        label: "Crear",
        sr: "Abrir el panel para la creación de relatos",
        icon: BookPlus,
      },
    ],
  ]);

  const otherPanels = [...allPanels].filter(([key, _]) => key !== currentPanel);

  return (
    <div className="p-4 flex justify-end gap-2">
      <ButtonGroup>
        {otherPanels.map(([panelKey, _]) => {
          const config = allPanels.get(panelKey)!;
          return (
            <Button
              key={panelKey}
              variant="outline"
              onClick={() => goToPanel(panelKey)}
            >
              <span className="sr-only">{config.sr}</span>
              <span aria-hidden="true">{config.label}</span>
              <config.icon />
            </Button>
          );
        })}
      </ButtonGroup>
    </div>
  );
}
