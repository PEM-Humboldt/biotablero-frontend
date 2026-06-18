import { type UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { useEffect } from "react";
import { useOutletContext } from "react-router";

export function PageTitleUpdater({
  title = "",
  subtitle = "",
}: {
  title?: string;
  subtitle?: string;
}) {
  const { layoutDispatch } = useOutletContext<UiManager>();

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.HEADER_NAMES,
      newHeader: { title, subtitle },
    });
  }, [layoutDispatch, title, subtitle]);

  return null;
}
