import { type ComponentType } from "react";

export type MessageWrapperType = "loading" | "no-data" | "custom" | null;

interface MessageProps {
  customMessage?: string;
  loadStatus: MessageWrapperType;
}

type WrapperProps<T> = MessageProps & T;

const wrapperMessages = {
  loading: () => "Cargando información...",
  "no-data": () => "Información no disponible",
  custom: (message?: string) => message ?? null,
};

export function withMessageWrapper<T extends object>(
  WrappedComponent: ComponentType<T>,
) {
  return ({ customMessage, loadStatus, ...otherProps }: WrapperProps<T>) => {
    let loadingMessage: string | null = null;
    if (customMessage !== undefined) {
      loadingMessage = customMessage;
    } else if (loadStatus) {
      loadingMessage = wrapperMessages[loadStatus](customMessage);
    }

    return loadingMessage !== null ? (
      <div className="errorData">{loadingMessage}</div>
    ) : (
      <WrappedComponent {...(otherProps as T)} />
    );
  };
}
