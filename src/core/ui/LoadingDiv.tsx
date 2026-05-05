import { cn } from "@ui/shadCN/lib/utils";

export function LoadingDiv({
  text = "Cargando...",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full bg-muted border border-primary/30 text-3xl text-primary rounded-lg p-4",
        className,
      )}
    >
      {text}
    </div>
  );
}
