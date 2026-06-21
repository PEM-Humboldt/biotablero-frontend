import { useStats } from "pages/monitoring/outlets/initiativesMap/hooks/useStats";
import { ErrorsList } from "@ui/LabelingWithErrors";
import {
  Binoculars,
  FileBadge,
  type LucideIcon,
  UsersRound,
  VectorSquare,
} from "lucide-react";
import { useParams } from "react-router";
import { Spinner } from "@ui/shadCN/component/spinner";

export function GeneralStats() {
  const { initiativeId } = useParams();
  const { isLoading, errors, stats } = useStats("General");

  return (
    <>
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent p-4 rounded-lg"
      />

      {initiativeId === undefined && (
        <StatValue
          isLoaging={isLoading}
          value={stats?.enabledInitiatives ?? 0}
          Icon={Binoculars}
          text="Iniciativas realizando monitoreo"
          description="Iniciativas de monitoreo activas en el área seleccionada"
        />
      )}

      <StatValue
        isLoaging={isLoading}
        value={stats?.peopleInvolved ?? 0}
        Icon={UsersRound}
        text={
          initiativeId
            ? "Colaboradores registrados en la iniciativa"
            : "Colaboradores registrados en las iniciativas"
        }
        description="Personas registradas como colaboradores"
      />

      <StatValue
        isLoaging={isLoading}
        value={stats?.area ?? 0}
        Icon={VectorSquare}
        text={
          initiativeId
            ? "Area cubierta por la iniciativa"
            : "Area donde se realiza monitoreo comunitario"
        }
        unit="ha"
      />

      <StatValue
        isLoaging={isLoading}
        value={stats?.enabledInitiatives ?? 0}
        Icon={FileBadge}
        text={
          initiativeId
            ? "Convenios que apoyan la iniciativa"
            : "Convenios apoyando las iniciativas"
        }
      />
    </>
  );
}

function StatValue({
  isLoaging,
  value,
  unit,
  Icon,
  text,
  description,
}: {
  isLoaging: boolean;
  value: number;
  unit?: string;
  Icon: LucideIcon;
  text: string;
  description?: string;
}) {
  const displayValue = new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 2,
  }).format(value);

  return (
    <div title={description} className="flex gap-1 py-2 lg:py-4 items-center">
      <Icon
        className="size-8 lg:size-10 flex-1"
        strokeWidth={1}
        aria-hidden="true"
      />
      <div className="flex-5 border-l border-grey pl-2 lg:pl-4">
        <div className="font-normal">
          <span className="text-2xl inline-flex gap-1 items-center">
            {displayValue}
            {isLoaging && <Spinner className="size-6 text-primary" />}
          </span>
          {unit && <span className="text-xl">{unit}</span>}
        </div>
        <div className="font-light text-base lg:text-lg text-balance">
          {text}
        </div>
      </div>
    </div>
  );
}
