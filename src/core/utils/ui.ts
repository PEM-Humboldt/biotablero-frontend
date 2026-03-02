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
