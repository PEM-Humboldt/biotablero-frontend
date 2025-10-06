import type { UserType } from "core/types/user";
import { getCredentials, partialComparison } from "core/utils/getCredentials";
import { redirect } from "react-router";

type Path = `/${string}`;

type CheckNLoadProps<ReturnType, CriticalReturnType> = {
  requirements: Partial<UserType>;
  redirectPath?: Path;
  fetchCriticalData?: (user: UserType) => Promise<CriticalReturnType>;
  fetchData?: (user: UserType) => Promise<ReturnType>;
  onFetchFailure?: () => void;
};

export type CheckNLoadReturn<ReturnType, CriticalReturnType> = Promise<{
  userData: Promise<ReturnType> | null;
  criticalUserData: CriticalReturnType | null;
} | null>;

/**
 * Validates the current user and fetches optional critical and non-critical data.
 *
 * @template T - Type returned by the non-critical data fetcher.
 * @template U - Type returned by the critical data fetcher.
 *
 * @param obj an object with the following shape:
 * @param obj.requirements - A Partial<UserType> object with properties that must be verified.
 * @param obj.redirectPath - Path to redirect if validation fails.
 * @param obj.fetchCriticalData - Async callback for critical user data.
 * @param obj.fetchData - Async callback for additional user data.
 * @param obj.onFetchFailiure - Optional callback when any data fetcher fails.
 *
 * @returns A promise resolving to:
 * - `{ userData, criticalUserData }` if validation succeeds.
 * - `null` if validation fails or user is not available.
 *
 * Notes:
 * - `userData` is wrapped in a promise to enable Suspense/partial loading.
 * - `criticalUserData` is awaited immediately and required before continuing.
 */
export async function checkNLoad<T, U>({
  requirements,
  redirectPath,
  fetchCriticalData,
  fetchData,
  onFetchFailure: onFetchFailiure,
}: CheckNLoadProps<T, U>): CheckNLoadReturn<T, U> {
  const user = await getCredentials();
  if (!user) {
    redirectTo(redirectPath);
    return null;
  }

  if (!partialComparison(user, requirements)) {
    redirectTo(redirectPath);
    return null;
  }

  let criticalUserData: U | null = null;
  try {
    criticalUserData = fetchCriticalData ? await fetchCriticalData(user) : null;
  } catch (err) {
    console.error("Cannot retrieve critical user data:", err);
    if (onFetchFailiure) {
      onFetchFailiure();
    }
    throw err;
  }

  const dataPromise = fetchData
    ? Promise.resolve(
        fetchData(user).catch((err) => {
          console.error("Cannot retrieve user data:", err);
          if (onFetchFailiure) {
            onFetchFailiure();
          }
          throw err;
        }),
      )
    : null;

  return { userData: dataPromise, criticalUserData };
}

/**
 * Redirects if a path is provided.
 *
 * @param redirectPath - Path to redirect, must start with "/".
 */
function redirectTo(redirectPath?: Path): void {
  if (!redirectPath) {
    return;
  }

  // NOTE: ESLint marca error si `throw` no lanza un Error, pero `redirect`
  // necesita usarse con `throw` para que el redireccionamiento funcione.
  //
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw redirect(redirectPath);
}
