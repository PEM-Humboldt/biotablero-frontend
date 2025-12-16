import { getUserLevels } from "pages/monitoring/api/monitoringAPI";
import type { UserLevel } from "pages/monitoring/types/monitoring";

export const USER_LEVELS: UserLevel[] = await getUserLevels();
