import type { ODataIndicator } from "pages/monitoring/types/odataResponse";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";

export async function getIndicatorsByInitiative(initiativeId: number) {
  const getIndicators = createODataGetter<ODataIndicator>("Indicator");

  const res = await getIndicators({
    filter: `initiativeId eq ${initiativeId}`,
  });

  return res;
}
