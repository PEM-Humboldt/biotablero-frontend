import { JoinRequests } from "pages/monitoring/outlets/myProfile/JoinRequest";
import { InitiativeUpdater } from "pages/monitoring/outlets/myProfile/InitiativeUpdater";
import { useUserCTX } from "@hooks/UserContext";
import { useUserInMonitoringCTX } from "../hooks/useUserInitiativesCTX";
import { useNavigate } from "react-router";
import { Button } from "@ui/shadCN/component/button";
import {
  Binoculars,
  BookMarked,
  MessageSquareText,
  NotebookPen,
} from "lucide-react";
import { cn } from "@ui/shadCN/lib/utils";
import { useEffect, useState } from "react";
import { UserStats } from "../types/user";
import { getUserStats } from "../api/services/user";
import { isMonitoringAPIError } from "../api/types/guards";

export function MyProfile() {
  const { user, updateUser } = useUserCTX();
  const { userInitiativesAs } = useUserInMonitoringCTX();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStats = async () => {
      const res = await getUserStats();
      if (isMonitoringAPIError(res)) {
        setErrors(res.data.map((err) => err.msg));
        return;
      }

      setUserStats(res);
    };

    void fetchUserStats();
  }, []);

  if (!user) {
    void navigate("/Monitoreo");
    return;
  }

  return (
    <main className="page-main [&>section]:w-full [&>section]:mb-4 lg:[&>section]:mb-8">
      <header>
        <h3>Mi Perfíl</h3>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <h3 className="sr-only">Información de mi cuenta</h3>
        <div className="border border-muted rounded-lg bg-background p-4 lg:p-8 flex gap-4 lg:gap-8 items-start">
          <img src={user.picture} className="rounded-full flex-1" alt="" />
          <ul aria-label="Datos registrados" className="flex-2">
            <li
              className="text-3xl font-normal mb-4"
              aria-label="nombre completo"
            >
              {user.firstName} {user.lastName}
            </li>
            <li aria-label="correo de contacto" className="mb-4">
              <a
                href={`mailto:${user.email}`}
                className="text-primary font-normal"
              >
                {user.email}
              </a>
            </li>
            <li>
              <span className="font-normal">Género: </span>
              {user.genero}
            </li>
            <li>
              <span className="font-normal">Autoreconocimiento étnico: </span>
              {user.autorreconocimiento}
            </li>
            <li>
              <span className="font-normal">Organización: </span>
              {user.organizacion}
            </li>
            <li className="flex justify-end mt-6">
              <Button onClick={() => void updateUser()}>
                <NotebookPen />
                Editar mi información
              </Button>
            </li>
          </ul>
        </div>
        <ul
          aria-label="Mis contribuciones"
          className={cn(
            "flex gap-4 w-full",
            "*:border *:border-muted *:rounded-lg *:bg-background *:p-2 *:lg:p-4",
            "*:flex *:flex-col *:flex-1 *:gap-4",
          )}
        >
          {userStats && userStats.totalInitiatives !== undefined && (
            <li>
              <span aria-hidden="true">
                <Binoculars />
              </span>
              {userStats.totalInitiatives}
              <span>Iniciativas a las que pertenezco</span>
            </li>
          )}
          {userStats && userStats.totalResources !== undefined && (
            <li>
              <span aria-hidden="true">
                <BookMarked />
              </span>
              {userStats.totalResources}
              <span>Recursos de monitoreo que he publicado</span>
            </li>
          )}
          {userStats && userStats.totalTerritoryStories !== undefined && (
            <li>
              <span aria-hidden="true">
                <MessageSquareText />
              </span>
              {userStats.totalTerritoryStories}
              <span>Relatos del territorio que he publicado</span>
            </li>
          )}
        </ul>
      </section>

      <section>
        <h3 className="sr-only">Administración de iniciativas</h3>
        <JoinRequests />
        <InitiativeUpdater />
      </section>

      <section aria-labelledby="heading-leader">
        <h3 id="heading-leader" aria-label="Iniciativas que lidero">
          lider
        </h3>
        <div>Tarjeta de iniciativa</div>
      </section>

      <section aria-labelledby="heading-collaborator">
        <h3
          id="heading-collaborator"
          aria-label="Iniciativas en las que colaboro"
        >
          Collaborador
        </h3>
        <div>Tarjeta de iniciativa</div>
      </section>

      <section aria-labelledby="heading-observer">
        <h3 id="heading-observer" aria-label="Iniciativas que observo">
          Collaborador
        </h3>
        <div>Tarjeta de observador</div>
      </section>
    </main>
  );
}
