import {
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { uiText } from "@composites/richTextEditor/layout/uiTextAndSettings";

export function UndoRedo() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor]);

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="icon"
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title={uiText.history.undo.title}
      >
        <span className="sr-only">{uiText.history.undo.sr}</span>
        <uiText.history.undo.icon aria-hidden="true" className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title={uiText.history.redo.title}
      >
        <span className="sr-only">{uiText.history.redo.sr}</span>
        <uiText.history.redo.icon aria-hidden="true" className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  );
}
