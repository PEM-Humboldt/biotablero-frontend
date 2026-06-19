import { useEffect } from "react";
import { useOutletContext } from "react-router";
import { PageTitleUpdater } from "@ui/PageTitleUpdater";

import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";

export function Help() {
  const { layoutDispatch } = useOutletContext<UiManager>();

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.HEADER_NAMES,
      newHeader: { title: "Ayuda", subtitle: "" },
    });
  }, [layoutDispatch]);

  return (
    <div>
      <PageTitleUpdater title="Ayuda" />

      <h3>Una pagina de ayudas por acá</h3>
    </div>
  );
}
