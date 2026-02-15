import { RoleInInitiative } from "@appTypes/user";
import { ButtonProps, Button } from "@ui/shadCN/component/button";

import { useUserInMonitoringCTX } from "pages/monitoring/hooks/useUserInitiativesCTX";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { ReactNode, useCallback, useEffect, useState } from "react";
import type { ODataParams } from "@appTypes/odata";
import {
  getInitiativeRequests,
  isMonitoringAPIError,
  requestJoinInitiative,
} from "pages/monitoring/api/monitoringAPI";
import { useUserCTX } from "@hooks/UserContext";
import { commonErrorMessage, getErrorMessage } from "@utils/ui";
import type { JoinRequestStatus } from "pages/monitoring/types/catalog";
import { Spinner } from "@ui/shadCN/component/spinner";
import { toast } from "sonner";
import { LucideIcon, Send, UserRoundX } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@ui/shadCN/component/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/shadCN/component/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { DestructiveConfirmationDialog } from "./DestructiveConfirmationDialog";
// TODO: Obtener las solicitudes de esta pag
// Crear juego de estados
// - si es lider, no mostrar
// - si es participante, opcion eliminar,
// - si es solicitante opcion de cancelar,
// - si no es naiden, mandar a logeo,
// - si es usuario solicitar
// conectar accion con las api correspondiente
// montar modal
//
//

export function JoinInitiativeRequestButton({
  overrideInitiativeId,
}: {
  overrideInitiativeId?: number;
}) {
  const { userRoleByInitiativeId } = useUserInMonitoringCTX();
  const { initiativeId, userInInitiativeInfo, initiativeInfo } =
    useInitiativeCTX();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<JoinRequestStatus | null>(
    null,
  );
  const finalId = overrideInitiativeId ?? initiativeId ?? 0;

  console.log("perfil:", userInInitiativeInfo, "loading:", isLoading);

  const getRequestStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initiativeId) {
        return;
      }

      const requestStatus = await getInitiativeRequests(initiativeId, {
        top: 0,
        filter: `userName eq '${userInInitiativeInfo?.userName}'`,
      });

      if (isMonitoringAPIError(requestStatus)) {
        const { status, message, data } = requestStatus;
        setError(
          `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
        );

        setRequestStatus(null);
        return;
      }

      const userRequestStatus =
        requestStatus?.value.filter(
          (req) => req.userName === userInInitiativeInfo?.userName,
        )[0].status ?? null;

      setRequestStatus(userRequestStatus);
    } catch (err) {
      console.error(err);
      setError(`Error crítico: ${getErrorMessage(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [initiativeId, userInInitiativeInfo?.userName]);

  useEffect(() => {
    void getRequestStatus();
  }, [getRequestStatus]);

  const handleJoinInitiative = async () => {
    if (!initiativeId) {
      return;
    }
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // const joinRequest = await requestJoinInitiative(
      //   initiativeId,
      //   RoleInInitiative.USER,
      // );
      //
      // if (isMonitoringAPIError(joinRequest)) {
      //   const { status, message, data } = joinRequest;
      //   setError(
      //     `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
      //   );
      //
      //   setRequestStatus(null);
      //   return;
      // }

      toast("Solicitud enviada", {
        position: "bottom-right",
        description:
          "Ya notificamos a las personas que administran la iniciativa sobre tu solicitud, te estaremos comunicando su respuesta.",
        icon: <Send className="size-8 text-primary" />,
        className: "px-6! gap-6! border-2! border-primary!",
      });
    } catch (err) {
      console.error(err);
      setError(`Error crítico: ${getErrorMessage(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async () => {};

  const handelLeaveInitiative = async () => {
    if (!initiativeInfo || !userInInitiativeInfo) {
      return;
    }
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // const joinRequest = await requestJoinInitiative(
      //   initiativeId,
      //   RoleInInitiative.USER,
      // );
      //
      // if (isMonitoringAPIError(joinRequest)) {
      //   const { status, message, data } = joinRequest;
      //   setError(
      //     `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
      //   );
      //
      //   setRequestStatus(null);
      //   return;
      // }

      toast(`Has abandonado ${initiativeInfo.name}`, {
        position: "bottom-right",
        description:
          "Lamentamos tu partida, a partir de este momento pierdes acceso a la información interna de esta iniciativa y dejarás de recibir notificaciones. Si es un error, comunícate con alguno de los administradores",
        icon: <UserRoundX className="size-8 text-accent" />,
        className: "px-6! gap-6! border-2! border-accent!",
        duration: 10 * 1000,
      });
    } catch (err) {
      console.error(err);
      setError(`Error crítico: ${getErrorMessage(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!initiativeId) {
    return null;
  }

  switch (userInInitiativeInfo?.level.id) {
    case RoleInInitiative.LEADER:
      return null;

    case RoleInInitiative.USER:
    case RoleInInitiative.VIEWER:
      return (
        <DestructiveConfirmationDialog
          texts={{
            trigger: { label: "Abandonar la iniciativa" },
            dialog: {
              title: `Estás a punto de unirte a ${initiativeInfo?.name}`,
            },
          }}
          triggerBtnVariant="outline_destructive"
          handler={() => void handelLeaveInitiative()}
          isLoading={isLoading}
        />
      );

    default:
      return (
        <ConfirmationDialog
          texts={{
            trigger: { label: "Unirse a la iniciativa" },
            dialog: {
              title: `Estás a punto de unirte a ${initiativeInfo?.name}`,
            },
          }}
          triggerBtnVariant="default"
          handler={() => void handleJoinInitiative()}
          isLoading={isLoading}
        />
      );
  }
}
