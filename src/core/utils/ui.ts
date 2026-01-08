export const inputLengthCount = (
  currentString: string,
  maxLength: number,
  threshold: number = 0.9,
) => {
  return currentString.length > Math.floor(maxLength * threshold)
    ? `${currentString.length} / ${maxLength}`
    : "";
};

export const inputWarnColor = (
  currentString: string,
  maxLength: number,
  threshold: number = 0.95,
) => {
  return currentString.length > Math.floor(maxLength * threshold)
    ? "text-accent"
    : "text-primary";
};

export const commonErrorMessage: Record<number, string> = {
  401: "Tu sesión ha expirado, ingresa de nuevo.",
  403: "No tienes permisos para esta acción.",
  500: "Error en el servidor monitoreo, vuelve a intentarlo más tarde.",
};
