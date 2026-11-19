import type {
  InitiativeDisplayInfo,
  InitiativeDisplayInfoShort,
} from "pages/monitoring/types/initiative";
import { uiText } from "pages/monitoring/outlets/initiativesAdmin/layout/uiText";
import { makeInitiativeLocationsString } from "@utils/format";

export function InitiativeTag({
  initiative,
}: {
  initiative: InitiativeDisplayInfoShort | InitiativeDisplayInfo;
}) {
  const date = new Date(initiative.creationDate).toLocaleDateString("es-CO");
  const displayName = initiative.shortName
    ? `${initiative.name}, ${initiative.shortName}`
    : initiative.name;
  const initiativeLocations = makeInitiativeLocationsString(
    initiative.locations,
    " / ",
  );

  return (
    <>
      <div className="shrink-0 text-center">{date}</div>
      <div className="flex-1 min-w-0 *:px-2 *:truncate">
        <div className="text-base font-semibold border-b border-b-primary/10">
          {displayName}
          {!initiative.enabled && (
            <span className="sr-only">
              {uiText.initiative.accordionResume.disabledPresentation}
            </span>
          )}
        </div>
        <div className="text-sm">
          <span className="sr-only">
            {uiText.initiative.accordionResume.locationPresentation}
          </span>
          {initiativeLocations}
        </div>
      </div>
      {!initiative.enabled && (
        <strong className="shrink-0 text-base " aria-hidden="true">
          {uiText.initiative.disabled}
        </strong>
      )}
    </>
  );
}
