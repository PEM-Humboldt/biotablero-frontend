import { useReport } from "@hooks/useReport";
import { Button } from "@ui/shadCN/component/button";
import { ClipboardPen } from "lucide-react";
import { useUserCTX } from "@hooks/UserCTX";
import { uiText } from "@ui/openReportEditorBtn/layout/uiText";

export function OpenReportEditorBtn() {
  const { user } = useUserCTX();
  const { hasSections, toggleEditor } = useReport();

  let texts = null;
  if (!user) {
    texts = uiText["noUser"];
  } else if (!hasSections) {
    texts = uiText["noSections"];
  } else {
    texts = uiText["ready"];
  }

  return !texts ? null : (
    <Button
      disabled={!user || !hasSections}
      variant="outline"
      size="sm"
      onClick={() => toggleEditor(true)}
      title={texts.title}
      aria-label={texts.sr}
    >
      <ClipboardPen />
      {texts.label}
    </Button>
  );
}
