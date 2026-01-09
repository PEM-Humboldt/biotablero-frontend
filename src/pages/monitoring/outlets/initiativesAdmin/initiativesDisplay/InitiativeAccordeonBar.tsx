import { cn } from "@ui/shadCN/lib/utils";
import type {
  InitiativeDisplayInfo,
  InitiativeDisplayInfoShort,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

export function InitiativeAccordeonBar({
  initiative,
}: {
  initiative: InitiativeDisplayInfoShort | InitiativeDisplayInfo;
}) {
  const enable = initiative.enabled ? "Activa" : "Inactiva";
  const date = new Date(initiative.creationDate).toLocaleDateString("es-CO");
  const displayName = initiative.shortName
    ? `${initiative.name}, ${initiative.shortName}`
    : initiative.name;
  const initiativeLocations = initiative.locations
    .map((l) => {
      const municipality = l.municipality !== null ? `, ${l.municipality}` : "";
      const locality = l.locality !== null ? ` - ${l.locality}` : "";

      return `${l.department}${municipality}${locality}`;
    })
    .join(" / ");

  return (
    <>
      <div className="shrink-0 text-center">
        {!initiative.enabled && (
          <>
            <strong className="text-lg" aria-hidden="true">
              Inactiva
            </strong>
            <br />
          </>
        )}
        {date}
      </div>
      <div className="flex-1 min-w-0 *:px-2 *:truncate">
        <div className="text-lg font-semibold border-b border-b-primary/10">
          {displayName}
          {!initiative.enabled && (
            <span className="sr-only"> Iniciativa inactiva</span>
          )}
        </div>
        <div className="text-sm ">{initiativeLocations}</div>
      </div>
    </>
  );
}
