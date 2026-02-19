import { RoleInInitiative } from "pages/monitoring/types/catalog";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { useState } from "react";
import {
  isMonitoringAPIError,
  leaveInitiative,
  requestJoinInitiative,
} from "pages/monitoring/api/monitoringAPI";
import { commonErrorMessage, getErrorMessage } from "@utils/ui";
import { toast } from "sonner";
import { FileXCorner, Send, UserRoundX } from "lucide-react";
import { ConfirmationDialog } from "pages/monitoring/ui/ConfirmationDialog";
import { DestructiveConfirmationDialog } from "pages/monitoring/ui/DestructiveConfirmationDialog";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { UserStateInInitiative } from "pages/monitoring/types/userJoinRequest";

// TODO:
// conectar accion con las apis faltantes (estado, Cancelacion y salida)

export function JoinInitiativeRequestButton() {
  const { userStateInInitiative } = useInitiativeCTX();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  switch (userStateInInitiative) {
    case UserStateInInitiative.IDLE:
      return "cargando...";

    case UserStateInInitiative.GUEST:
      return "ir al login";

    case UserStateInInitiative.USER_NONE:
      return <MakeJoinInitiativeRequestBtnWithDialog />;

    case UserStateInInitiative.USER_PARTICIPANT:
    case UserStateInInitiative.USER_VIEWER:
      return <LeaveInitiativeBtnWithDialog />;

    case UserStateInInitiative.USER_ASPIRING:
      return <CancelJoinInitiativeRequestBtnWithDialog />;

    case UserStateInInitiative.USER_LEADER:
    case UserStateInInitiative.ADMIN:
    default:
      return null;
  }
}

function LeaveInitiativeBtnWithDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userInInitiativeInfo, initiativeInfo, userStateInInitiative } =
    useInitiativeCTX();

  const handelLeaveInitiative = async () => {
    if (
      !initiativeInfo ||
      !userInInitiativeInfo ||
      userStateInInitiative !== UserStateInInitiative.USER_PARTICIPANT
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const errorInResponse = await leaveInitiative(userInInitiativeInfo.id);

      if (errorInResponse) {
        setError(errorInResponse);
        return;
      }

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

  return (
    <>
      {error && <ErrorsList errorItems={[error]} />}
      <DestructiveConfirmationDialog
        texts={{
          trigger: { label: "Abandonar la iniciativa" },
          dialog: {
            title: `Estás a punto de abandonar a ${initiativeInfo?.name}`,
            description:
              "Al hacerlo perderás acceso a la información interna de esta iniciativa y dejarás de recibir notificaciones. Si es un error, comunícate con alguno de los administradores",
          },
        }}
        triggerBtnVariant="outline_destructive"
        handler={() => void handelLeaveInitiative()}
        isLoading={isLoading}
        disabled={Boolean(error)}
      />
    </>
  );
}

function CancelJoinInitiativeRequestBtnWithDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userInInitiativeInfo, initiativeInfo, userStateInInitiative } =
    useInitiativeCTX();

  const handleCancelRequest = async () => {
    if (
      !initiativeInfo ||
      !userInInitiativeInfo ||
      userStateInInitiative !== UserStateInInitiative.USER_ASPIRING
    ) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast("Cancelaste tu solicitud", {
        position: "bottom-right",
        description: `Tu solicitud de ingraso a ${initiativeInfo.name} ha sido cancelada`,
        icon: <FileXCorner className="size-8 text-accent" />,
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
  return (
    <>
      {error && <ErrorsList errorItems={[error]} />}
      <DestructiveConfirmationDialog
        texts={{
          trigger: { label: "Abandonar la iniciativa" },
          dialog: {
            title: `Vas a cancelar tu solicitud a ${initiativeInfo?.name}`,
            description: "...",
          },
        }}
        triggerBtnVariant="outline_destructive"
        handler={() => void handleCancelRequest()}
        isLoading={isLoading}
      />
    </>
  );
}

function MakeJoinInitiativeRequestBtnWithDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initiativeInfo } = useInitiativeCTX();

  const handleJoinInitiative = async () => {
    if (!initiativeInfo) {
      return;
    }
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const joinRequest = await requestJoinInitiative(
        initiativeInfo.id,
        RoleInInitiative.USER,
      );

      if (isMonitoringAPIError(joinRequest)) {
        const { status, message, data } = joinRequest;
        setError(
          `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
        );

        return;
      }

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

  return (
    <>
      {error && <ErrorsList errorItems={[error]} />}
      <ConfirmationDialog
        texts={{
          trigger: { label: "Unirse a la iniciativa" },
          dialog: {
            title: `Estás a punto de unirte a ${initiativeInfo?.name}`,
            description: "algo",
          },
        }}
        triggerBtnVariant="default"
        handler={() => void handleJoinInitiative()}
        isLoading={isLoading}
      />
    </>
  );
}
