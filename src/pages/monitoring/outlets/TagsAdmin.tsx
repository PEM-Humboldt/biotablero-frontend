import { useEffect } from "react";

import { useUserCTX } from "@hooks/UserContext";

export function TagsAdmin() {
  const { user } = useUserCTX();

  useEffect(() => {
    if (!user?.username) {
      return;
    }
  }, [user?.username]);

  return (
    <main className="page-main">
      <header>
        <h3>Tablero de etiquetas</h3>
      </header>
    </main>
  );
}
