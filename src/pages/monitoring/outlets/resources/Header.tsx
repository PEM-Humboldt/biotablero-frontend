import { useMemo } from "react";
import { useNavigate } from "react-router";
import { NotebookPen } from "lucide-react";

import { Button } from "@ui/shadCN/component/button";
import bannerUrl from "@assets/resourcesBanner.png";

import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { uiText } from "pages/monitoring/outlets/resources/layout/uiText";

export function Header() {
  const { userInitiativesAs } = useUserInMonitoringCTX();
  const navigate = useNavigate();
  const userLinkedInitiatives = useMemo(
    () => [
      ...(userInitiativesAs[RoleInInitiative.LEADER] ?? []),
      ...(userInitiativesAs[RoleInInitiative.USER] ?? []),
    ],
    [userInitiativesAs],
  );

  return (
    <header
      className="relative w-full h-[120px] md:h-[260px] flex items-center justify-center overflow-hidden bg-primary"
      style={{
        backgroundImage: `url('${bannerUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-[1600px] p-4 z-10 text-3xl md:text-5xl font-bold text-primary-foreground">
        <div className="w-full max-w-[500px] text-balance">
          {uiText.header.legend}
        </div>
        {userLinkedInitiatives.length > 0 && (
          <Button
            onClick={() => void navigate("/Monitoreo/Recursos/Admin")}
            className="self-end w-fit"
            variant="outline"
          >
            {uiText.header.button}
            <NotebookPen />
          </Button>
        )}
      </div>
    </header>
  );
}
