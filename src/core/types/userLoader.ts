export type CheckNLoadReturn<ReturnType, CriticalReturnType> = Promise<{
  userData: Promise<ReturnType> | null;
  criticalUserData: CriticalReturnType | null;
} | null>;
