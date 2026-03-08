import { useEffect, useState } from "react";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import {
  type SupportedTextFormats,
  textFormats,
} from "@composites/richTextEditor/layout/uiTextAndSettings";

export function TextFormatSelector() {
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          setActiveFormats({
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
            underline: selection.hasFormat("underline"),
          });
        }
      });
    });
  }, [editor]);

  const toggleFormat = (format: SupportedTextFormats) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <ButtonGroup>
      {Array.from(textFormats).map(([key, { label, icon: Icon }]) => (
        <Button
          key={key}
          variant={activeFormats[key] ? "default" : "outline"}
          size="icon"
          onClick={() => toggleFormat(key)}
          title={label}
        >
          <Icon className="size-4" />
        </Button>
      ))}
    </ButtonGroup>
  );
}
