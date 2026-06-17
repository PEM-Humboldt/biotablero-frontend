import { useStats } from "pages/monitoring/outlets/initiativesMap/hooks/useStats";
import { LoadingDiv } from "@ui/LoadingDiv";
import { ErrorsList } from "@ui/LabelingWithErrors";
import {
  Binoculars,
  FileBadge,
  type LucideIcon,
  UsersRound,
  VectorSquare,
} from "lucide-react";
import { useParams } from "react-router";

export function GeneralStats() {
  const { initiativeId } = useParams();
  const { isLoading, errors, stats } = useStats("General");

  return isLoading ? (
    <LoadingDiv />
  ) : (
    <>
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent p-4 rounded-lg"
      />

      {initiativeId === undefined && (
        <StatValue
          value={stats?.enabledInitiatives ?? 0}
          Icon={Binoculars}
          text="Iniciativas realizando monitoreo"
          description="Estas son todas las iniciativas de monitoreo activas en este momento"
        />
      )}

      <StatValue
        value={stats?.peopleInvolved ?? 0}
        Icon={UsersRound}
        text="Colaboradores registrados en las iniciativas"
        description="Estas son todas las personas que participan activamente en las iniciativas"
      />

      <StatValue
        value={stats?.area ?? 0}
        Icon={VectorSquare}
        text="Área bajo monitoreo comunitario"
        unit="ha"
      />

      <StatValue
        value={stats?.enabledInitiatives ?? 0}
        Icon={FileBadge}
        text="Convenios apoyando las iniciativas"
        description=""
      />
    </>
  );
}

function StatValue({
  value,
  unit,
  Icon,
  text,
  description,
}: {
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
    <div title={description} className="flex gap-1 py-4 items-center">
      <Icon className="size-10 flex-1" strokeWidth={1} aria-hidden="true" />
      <div className="flex-5 border-l border-grey pl-4">
        <div className="font-normal">
          <span className="text-4xl">{displayValue}</span>
          {unit && <span className="text-xl">{unit}</span>}
        </div>
        <div className="font-light text-lg text-balance">{text}</div>
      </div>
    </div>
  );
}
