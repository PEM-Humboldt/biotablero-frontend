import type { ReactNode } from "react";
import { cn } from "@ui/shadCN/lib/utils";

export function PlainInputContainer({
  isFieldset,
  children,
  hasError,
}: {
  isFieldset: boolean;
  hasError: boolean;
  children: ReactNode;
}) {
  const Container = isFieldset ? "fieldset" : "div";
  const containerProps = {
    className: cn(
      "rounded-lg flex flex-col gap-2",
      isFieldset ? "p-4" : "",
      isFieldset && hasError
        ? "bg-red-50 outline-2 outline-accent"
        : "bg-muted",
    ),
  };

  return <Container {...containerProps}>{children}</Container>;
}
