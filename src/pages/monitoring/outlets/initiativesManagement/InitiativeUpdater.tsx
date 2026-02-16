import type { UserInitiatives } from "pages/monitoring/types/requestParams";

export function InitiativeUpdater({
  initiativesAsLeader,
}: {
  initiativesAsLeader: UserInitiatives[] | undefined;
}) {
  console.log(initiativesAsLeader);
  return null;
}
