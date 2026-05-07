import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { RoleInInitiative } from "pages/monitoring/types/catalog";
import { Button } from "@ui/shadCN/component/button";

import { NotebookPen } from "lucide-react";

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
        // backgroundImage: `url('${bannerUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 -bg-linear-300 from-primary to-transparent mix-blend-multiply" />

      <div className="w-full max-w-[1600px] p-4 z-10 text-3xl md:text-5xl font-bold text-primary-foreground">
        <div className="w-full max-w-[500px] text-balance">
          Nuestras experiencias son recursos valiosos
        </div>
        {userLinkedInitiatives.length > 0 && (
          <Button
            onClick={() => void navigate("/Monitoreo/Recursos/Admin")}
            className="self-end w-fit"
            variant="outline"
          >
            Administrar mis recursos
            <NotebookPen />
          </Button>
        )}
      </div>
    </header>
  );
}
