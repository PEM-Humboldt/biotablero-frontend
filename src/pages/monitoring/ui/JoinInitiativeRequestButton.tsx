import { RoleInInitiative } from "@appTypes/user";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { useCallback, useEffect, useState } from "react";
import {
  getInitiativeRequests,
  isMonitoringAPIError,
  leaveInitiative,
  requestJoinInitiative,
} from "pages/monitoring/api/monitoringAPI";
import { commonErrorMessage, getErrorMessage } from "@utils/ui";
import type { JoinRequestStatus } from "pages/monitoring/types/catalog";
import { toast } from "sonner";
import { FileXCorner, Send, UserRoundX } from "lucide-react";
import { ConfirmationDialog } from "pages/monitoring/ui/ConfirmationDialog";
import { DestructiveConfirmationDialog } from "pages/monitoring/ui/DestructiveConfirmationDialog";
import { useUserCTX } from "@hooks/UserContext";
import { ErrorsList } from "@ui/LabelingWithErrors";

// TODO:
// conectar accion con las apis faltantes (estado, Cancelacion y salida)

export function JoinInitiativeRequestButton() {
  const { user } = useUserCTX();
  const { initiativeId, userInInitiativeInfo, initiativeInfo } =
    useInitiativeCTX();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<JoinRequestStatus | null>(
    null,
  );

  // NOTE: Temporal mientras se define la api para conocer el estado de mi solicitud
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  useEffect(() => {
    const hasPendingRequest = async () => {
      const pending = await new Promise<boolean>((resolve) =>
        setTimeout(
          () =>
            resolve(
              Boolean(Math.round((Math.random() * (initiativeId ?? 2)) % 2)),
            ),
          500,
        ),
      );
      setHasPendingRequest(pending);
    };
    void hasPendingRequest();
  }, [initiativeId]);

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

      setRequestStatus(requestStatus?.value[0].status ?? null);
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
      const joinRequest = await requestJoinInitiative(
        initiativeId,
        RoleInInitiative.USER,
      );

      if (isMonitoringAPIError(joinRequest)) {
        const { status, message, data } = joinRequest;
        setError(
          `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
        );

        setRequestStatus(null);
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

  const handleCancelRequest = async () => {
    if (!initiativeInfo || !userInInitiativeInfo || !requestStatus) {
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

  const handelLeaveInitiative = async () => {
    if (!initiativeInfo || !userInInitiativeInfo) {
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

  if (error) {
    return <ErrorsList errorItems={[error]} />;
  }

  if (!initiativeId) {
    return null;
  }

  if (!user) {
    return <a href="https://login.humboldt.org.co">Unirse a la iniciativa</a>;
  }

  if (
    userInInitiativeInfo &&
    Number(userInInitiativeInfo.level.id) === Number(RoleInInitiative.LEADER)
  ) {
    return null;
  }

  if (userInInitiativeInfo) {
    return (
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
      />
    );
  }

  if (hasPendingRequest) {
    return (
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
    );
  }

  return (
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
  );
}
