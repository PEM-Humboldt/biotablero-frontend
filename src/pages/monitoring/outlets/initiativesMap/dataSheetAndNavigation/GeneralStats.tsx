import { useParams } from "react-router";
import {
  Binoculars,
  FileBadge,
  type LucideIcon,
  UsersRound,
  VectorSquare,
} from "lucide-react";

import { ErrorsList } from "@ui/LabelingWithErrors";
import { Spinner } from "@ui/shadCN/component/spinner";

import { useStats } from "pages/monitoring/outlets/initiativesMap/hooks/useStats";
import { uiText } from "pages/monitoring/outlets/initiativesMap/layout/uiText";

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
          Icon={Binoculars}
          value={stats?.enabledInitiatives ?? 0}
          unit={uiText.stats.general.initiativesCount.dataUnit}
          text={uiText.stats.general.initiativesCount.text}
          description={uiText.stats.general.initiativesCount.description}
        />
      )}

      <StatValue
        isLoaging={isLoading}
        Icon={UsersRound}
        value={stats?.peopleInvolved ?? 0}
        unit={uiText.stats.general.collaboratorsCount.dataUnit}
        text={uiText.stats.general.collaboratorsCount.text(
          Boolean(initiativeId),
        )}
        description={uiText.stats.general.collaboratorsCount.description}
      />

      <StatValue
        isLoaging={isLoading}
        Icon={VectorSquare}
        value={stats?.area ?? 0}
        unit={uiText.stats.general.monitoringArea.dataUnit}
        text={uiText.stats.general.monitoringArea.text(Boolean(initiativeId))}
        description={uiText.stats.general.monitoringArea.description}
      />

      <StatValue
        isLoaging={isLoading}
        Icon={FileBadge}
        value={stats?.agreementsInvolved ?? 0}
        unit={uiText.stats.general.initiativeSupport.dataUnit}
        text={uiText.stats.general.initiativeSupport.text(
          Boolean(initiativeId),
        )}
        description={uiText.stats.general.initiativeSupport.description}
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
