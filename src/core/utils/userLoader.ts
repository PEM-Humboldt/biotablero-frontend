import type { UserType } from "@appTypes/user";
import { getCredentials, partialComparison } from "@utils/getCredentials";
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
 * @template T - Type of the non-critical data returned by `fetchData`.
 * @template U - Type of the critical data returned by `fetchCriticalData`.
 *
 * @param obj - Configuration object with the following properties:
 * @param obj.requirements - Subset of user properties that must exactly match those of the authenticated user.
 *   - If this object is **empty**, no property validation is performed, any authenticated user passes.
 * @param obj.redirectPath - Path to redirect if validation fails. Optional.
 * @param obj.fetchCriticalData - Async callback for critical user data. Optional.
 * @param obj.fetchData - Async callback for additional user data. Optional.
 * @param obj.onFetchFailure - Callback invoked when any data fetch fails. Optional.
 *
 * @returns A promise resolving to:
 * - An object `{ userData, criticalUserData }` when validation succeeds:
 *   - `userData` — a promise resolving to `T | null`, which can be used with React Suspense.
 *   - `criticalUserData` — a resolved value of type `U | null`, available immediately.
 * - `null` if validation fails or no user is authenticated.
 *
 * Notes:
 * - `userData` is wrapped in a promise to support deferred or partial loading.
 * - `criticalUserData` is awaited immediately and required before proceeding.
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

  if (
    Object.keys(requirements).length !== 0 &&
    !partialComparison(user, requirements)
  ) {
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
