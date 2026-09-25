import { useMemo } from "react";

import { useUserCTX } from "@hooks/UserCTX";
import { useFeatureFlag } from "@hooks/useFeatureFlag";

import {
  displayModules,
  type DisplayModule,
} from "core/layout/mainLayout/modules";

export function useVisibleModules(): DisplayModule[] {
  const { user } = useUserCTX();

  const alertsModule = useFeatureFlag("alertsModule");
  const CBMModule = useFeatureFlag("CBMModule");

  return useMemo(() => {
    const baseModules = displayModules(user?.username);
    const featureFlags = { alertsModule, CBMModule };

    return baseModules.filter((module) => {
      if (!module.featureFlag) {
        return true;
      }

      return featureFlags[module.featureFlag as keyof typeof featureFlags];
    });
  }, [user?.username, alertsModule, CBMModule]);
}
