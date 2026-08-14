import { PageTitleUpdater } from "@ui/PageTitleUpdater";
import { parseSimpleMarkdown } from "@utils/textParser";
import { uiText } from "pages/monitoring/outlets/help/layout/uiText";

export function Help() {
  return (
    <div className="bg-primary w-full min-h-full">
      <PageTitleUpdater title="Ayuda" />

      <div>
        <h3>{uiText.title}</h3>
        <p>{parseSimpleMarkdown(uiText.descriptionMd)}</p>
      </div>
    </div>
  );
}
