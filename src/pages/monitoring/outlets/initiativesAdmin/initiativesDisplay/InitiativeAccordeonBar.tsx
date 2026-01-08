import type { ODataInitiativeEntry } from "pages/monitoring/types/requestParams";
import type { LocationObj } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

export function InitiativeAccordeonBar({
  info,
  locations,
}: {
  info: ODataInitiativeEntry;
  locations: LocationObj[];
}) {
  const enable = info.enabled ? "Active" : "Inactiva";
  const date = new Date(info.creationDate).toLocaleDateString("es-CO");
  const displayName = info.shortName
    ? `${info.name}, ${info.shortName}`
    : info.name;
  const initiativeLocations = locations
    .map((l) => {
      const municipality = l.municipality !== null ? `, ${l.municipality}` : "";
      const locality = l.locality !== null ? ` - ${l.locality}` : "";

      return `${l.department}${municipality}${locality}`;
    })
    .join(" / ");

  return (
    <>
      <div className="shrink-0">{date}</div>
      <div className="flex-1 min-w-0 *:px-2 *:truncate">
        <div className="text-lg font-semibold border-b border-b-primary/10">
          {displayName} {!info.enabled && <span>({enable})</span>}
        </div>
        <div className="text-sm ">{initiativeLocations}</div>
      </div>
    </>
  );
}
