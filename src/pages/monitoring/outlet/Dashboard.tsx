import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";

import { useUserCTX } from "@hooks/UserContext";
import type { CheckNLoadReturn } from "@utils/userLoader";

type LoadedDashboardUserData = Awaited<CheckNLoadReturn<number, number>>;

export function Dashboard() {
  const { user } = useUserCTX();
  const loaderData = useLoaderData<LoadedDashboardUserData>();

  if (!loaderData) {
    return null;
  }

  const { criticalUserData, userData } = loaderData;

  return (
    <div>
      <h1>
        El usuario es un {user?.roles[0]}, holi {user?.username}
      </h1>
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
