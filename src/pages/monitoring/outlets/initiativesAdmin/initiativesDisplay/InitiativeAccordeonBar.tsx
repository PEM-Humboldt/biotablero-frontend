import type {
  InitiativeDisplayInfo,
  InitiativeDisplayInfoShort,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

export function InitiativeAccordeonBar({
  initiative,
}: {
  initiative: InitiativeDisplayInfoShort | InitiativeDisplayInfo;
}) {
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
      <div className="shrink-0 text-center">{date}</div>
      <div className="flex-1 min-w-0 *:px-2 *:truncate">
        <div className="text-base font-semibold border-b border-b-primary/10">
          {displayName}
          {!initiative.enabled && (
            <span className="sr-only">, Iniciativa inactiva</span>
          )}
        </div>
        <div className="text-sm">
          <span className="sr-only">Iniciativa ubicada en:</span>
          {initiativeLocations}
        </div>
      </div>
      {!initiative.enabled && (
        <strong className="shrink-0 text-base " aria-hidden="true">
          Inactiva
        </strong>
      )}
    </>
  );
}
