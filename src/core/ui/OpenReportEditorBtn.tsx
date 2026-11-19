import { ClipboardPen } from "lucide-react";

import { Button, ButtonProps } from "@ui/shadCN/component/button";
import { cn } from "@ui/shadCN/lib/utils";
import { uiText } from "@ui/openReportEditorBtn/layout/uiText";
import { useReport } from "@hooks/useReport";
import { useUserCTX } from "@hooks/UserCTX";

export function OpenReportEditorBtn({
  className,
  onClick,
  ...props
}: ButtonProps) {
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
      variant="ghost"
      onClick={(e) => {
        toggleEditor(true);
        onClick?.(e);
      }}
      title={texts.title}
      aria-label={texts.sr}
      className={cn(
        "ml-auto mr-2 text-background hover:text-accent hover:bg-background",
        className,
      )}
      size={"sm"}
      {...props}
    >
      {texts.label}
      <ClipboardPen className="size-5" />
    </Button>
  );
}
