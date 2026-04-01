import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { JoinInitiativeRequestButton } from "pages/monitoring/ui/JoinInitiativeRequestButton";

export function Profile() {
  const { userStateInInitiative } = useInitiativeCTX();
  return (
    <div>
      <JoinInitiativeRequestButton />
      nivel: {userStateInInitiative}
    </div>
  );
}
