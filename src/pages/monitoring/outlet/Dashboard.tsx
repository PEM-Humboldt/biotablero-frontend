import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";

import { useUserCTX } from "app/UserContext";
import type { CheckNLoadReturn } from "app/utils/userLoader";

type LoadedDashboardUserData = Awaited<CheckNLoadReturn<number, number>>;

export function DashboardUser() {
  const { user } = useUserCTX();
  const loaderData = useLoaderData<LoadedDashboardUserData>();

  if (!loaderData) {
    return null;
  }

  const { criticalUserData, userData } = loaderData;

  return (
    <div>
      <h1>Dashboard Usuario, holi {user?.username}</h1>
      <h2>Un número random para el usuario: {criticalUserData}</h2>

      {user && <p style={{ textAlign: "center" }}>{user.username}</p>}

      {userData && (
        <Suspense
          fallback={<div style={{ textAlign: "center" }}>cargandoooo...</div>}
        >
          <Await resolve={userData}>
            {(num) => (
              <p style={{ textAlign: "center" }}>otro número random: {num}</p>
            )}
          </Await>
        </Suspense>
      )}
    </div>
  );
}

export function DashboardAdmin() {
  const { user } = useUserCTX();
  const loaderData = useLoaderData<LoadedDashboardUserData>();

  if (!loaderData) {
    return null;
  }

  const { criticalUserData, userData } = loaderData;

  return (
    <div>
      <h1>Dashboard Admin, holi {user?.username}</h1>
      <h2>Un número random para el usuario: {criticalUserData}</h2>

      {user && <p style={{ textAlign: "center" }}>{user.username}</p>}

      {userData && (
        <Suspense fallback={<div>cargandoooo...</div>}>
          <Await resolve={userData}>
            {(num) => (
              <p style={{ textAlign: "center" }}>otro número random: {num}</p>
            )}
          </Await>
        </Suspense>
      )}
    </div>
  );
}
