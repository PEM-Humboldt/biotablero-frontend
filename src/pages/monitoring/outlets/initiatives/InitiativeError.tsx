import { HeartCrack } from "lucide-react";
import { Link } from "react-router";

export function InitiativeError({ msg }: { msg: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <HeartCrack size={96} strokeWidth={1} className="text-accent" />
      <h2 className="text-xl font-bold">Algo salió mal</h2>
      <p>{msg}</p>
      <Link
        to="/Monitoreo/Iniciativas"
        className="underline text-primary hover:text-accent"
      >
        Volver al buscador
      </Link>
    </div>
  );
}
