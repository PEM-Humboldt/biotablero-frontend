import type { UserType } from "app/uim/types";
import { getCredentials, partialComparison } from "app/utils/getCredentials";
import { redirect } from "react-router";

type Path = `/${string}`;

type UserCheckNLoad<ReturnType, CriticalReturnType> = {
  requirements: Partial<UserType>;
  redirectPath?: Path;
  criticalFetcher?: (user: UserType) => Promise<CriticalReturnType>;
  regularFetcher?: (user: UserType) => Promise<ReturnType>;
  onFetchFailiure?: () => void;
};

/**
 * Validates the current user and fetches optional critical and non-critical data.
 *
 * @template T - Type returned by the non-critical data fetcher.
 * @template U - Type returned by the critical data fetcher.
 *
 * @param obj an object with the following shape:
 * @param obj.requiredUserData - A Partial<UserType> object with properties that must be verified.
 * @param obj.redirectPath - Path to redirect if validation fails.
 * @param obj.criticalFetcher - Async callback for critical user data.
 * @param obj.regularFetcher - Async callback for additional user data.
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
export async function userCheckNLoad<T, U>({
  requirements,
  redirectPath,
  criticalFetcher,
  regularFetcher,
  onFetchFailiure,
}: UserCheckNLoad<T, U>): Promise<{
  userData: Promise<T> | null;
  criticalUserData: U | null;
} | null> {
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
    criticalUserData = criticalFetcher ? await criticalFetcher(user) : null;
  } catch (err) {
    console.error("Cannot retreive critical user data:", err);
    if (onFetchFailiure) {
      onFetchFailiure();
    }
    throw err;
  }

  const dataPromise = regularFetcher
    ? Promise.resolve(
        regularFetcher(user).catch((err) => {
          console.error("Cannot retreive user data:", err);
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
