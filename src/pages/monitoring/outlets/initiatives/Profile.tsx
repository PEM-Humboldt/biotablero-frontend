import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { JoinInitiativeRequestButton } from "pages/monitoring/ui/JoinInitiativeRequestButton";

export function Profile() {
  const { userStateInInitiative, initiativeInfo } = useInitiativeCTX();

  return (
    <div>
      <JoinInitiativeRequestButton />
      nivel: {userStateInInitiative}
      {Object.entries(initiativeInfo ?? {}).map(([k, v]) => (
        <div key={k}>
          <span>{k}: </span>
          <span className="font-bold">
            {typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)}
          </span>
        </div>
      ))}
    </div>
  );
}
