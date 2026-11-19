import { useEffect } from "react";
import { useOutletContext } from "react-router";

import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { parseSimpleMarkdown } from "@utils/textParser";
import tos from "pages/tos/termsOfService.md?raw";

export function ToS() {
  const { layoutDispatch } = useOutletContext<UiManager>();
  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleInfo: { name: "", icon: null },
        logos: new Set(),
        className: "",
      },
    });
  }, [layoutDispatch]);

  return (
    <div className="p-2 md:p-8">
      <article className="markdown-renderer max-w-[65ch] mx-auto">
        {parseSimpleMarkdown(tos, { headingsOffset: 2 })}
      </article>
    </div>
  );
}
