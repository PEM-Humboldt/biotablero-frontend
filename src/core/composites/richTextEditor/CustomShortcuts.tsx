import { useEffect } from "react";
import {
  $getSelection,
  $isRangeSelection,
  INDENT_CONTENT_COMMAND,
  KEY_TAB_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_CRITICAL,
  KEY_DOWN_COMMAND,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, type HeadingTagType } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";

export function CustomShortcuts() {
  return (
    <>
      <TabIndentation />
      <ToolbarShortcuts />
    </>
  );
}

function TabIndentation() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // NOTE: Permitir la indentacion sin saltar de focus
    return editor.registerCommand(
      KEY_TAB_COMMAND,
      (payload: KeyboardEvent) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        payload.preventDefault();

        if (payload.shiftKey) {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        } else {
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}

function ToolbarShortcuts() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (payload: KeyboardEvent) => {
        const { code, ctrlKey, metaKey } = payload;
        const isModifier = ctrlKey || metaKey;

        const isHeadingShortcut =
          isModifier &&
          payload.altKey &&
          ["Digit1", "Digit2", "Digit3", "Digit4"].includes(code);

        if (isHeadingShortcut) {
          payload.preventDefault();
          const level = code.replace("Digit", "");
          const tag = `h${Number(level)}` as HeadingTagType;

          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode(tag));
            }
          });
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor]);

  return null;
}
