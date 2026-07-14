import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";

export function OccupationSpecies() {
  const { currentIndicator } = useIndicatorsCTX();

  if (!currentIndicator) {
    return null;
  }

  return <div>{JSON.stringify(currentIndicator.cleanData, null, 2)}</div>;
}
