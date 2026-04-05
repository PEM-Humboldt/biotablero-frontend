import { HeartCrack } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@ui/shadCN/component/button";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { cn } from "@ui/shadCN/lib/utils";

export function InitiativeError({
  msg,
  goBack,
  errors,
  className,
}: {
  msg: string;
  goBack?: string;
  errors?: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full h-full",
        className,
      )}
    >
      <HeartCrack size={96} strokeWidth={1} className="text-accent" />
      <h2 className="text-xl font-bold">Algo salió mal</h2>
      <p>{msg}</p>
      <ErrorsList errorItems={errors ?? []} />
      <Button asChild>
        <Link
          to={goBack ?? "/Monitoreo/Iniciativas"}
          className="underline text-primary hover:text-accent"
        >
          Volver al buscador
        </Link>
      </Button>
    </div>
  );
}
