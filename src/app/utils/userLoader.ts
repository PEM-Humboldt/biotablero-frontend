import type { UserType } from "app/uim/types";
import { getCredentials, partialComparison } from "app/utils/getCredentials";
import { redirect } from "react-router";

type Path = `/${string}`;

/**
 * Validates the current user and optionally fetches extra data.
 *
 * @template T - Type returned by the success data fetcher.
 * @param options.required - User properties that must match.
 * @param options.redirectPath - Path to redirect if validation fails.
 * @param options.onSuccessDataFetcher - Callback to fetch extra data when validation succeeds.
 * @returns A promise of `{ userData }` or `null` if validation fails or no callback is provided.
 */
export async function userCheckNLoad<T>({
  required,
  redirectPath,
  onSuccessDataFetcher,
}: {
  required: Partial<UserType>;
  redirectPath?: Path;
  onSuccessDataFetcher?: (user: UserType) => T;
}): Promise<{ userData: Promise<T> | null } | null> {
  const user = await getCredentials();
  if (!user) {
    redirectTo(redirectPath);
    return null;
  }

  if (!partialComparison(user, required)) {
    redirectTo(redirectPath);
    return null;
  }

  // NOTE: El retorno de la promesa permite el uso de suspense y la carga parcial
  const dataPromise = onSuccessDataFetcher
    ? Promise.resolve(onSuccessDataFetcher(user))
    : null;

  return { userData: dataPromise };
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

  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw redirect(redirectPath);
}
