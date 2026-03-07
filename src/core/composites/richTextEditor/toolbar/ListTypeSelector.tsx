import { useEffect, useState } from "react";
import { List, ListOrdered } from "lucide-react";
import { $getSelection, $isRangeSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";

import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import type { RenderSelector } from "@composites/richTextEditor/toolbar/types/items";

type SupportedListTypes = "ul" | "ol";
const listTypes: Map<SupportedListTypes, RenderSelector> = new Map([
  ["ul", { label: "Crear lista", icon: List }],
  ["ol", { label: "Crear lista ordenada", icon: ListOrdered }],
]);

export function ListTypeSelector() {
  const [editor] = useLexicalComposerContext();
  const [activeList, setActiveList] = useState<SupportedListTypes | null>(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getTopLevelElementOrThrow();

          if ($isListNode(element)) {
            const listType = element.getListType();
            setActiveList(listType === "bullet" ? "ul" : "ol");
          } else {
            setActiveList(null);
          }
        }
      });
    });
  }, [editor]);

  const selectListType = (type: SupportedListTypes) => {
    if (activeList === type) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      return;
    }

    if (type === "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <ButtonGroup>
      {Array.from(listTypes).map(([key, { label, icon: Icon }]) => (
        <Button
          key={key}
          variant={activeList === key ? "default" : "outline"}
          size="icon"
          onClick={() => selectListType(key)}
          title={label}
        >
          <span className="sr-only">{label}</span>
          <Icon className="size-4" />
        </Button>
      ))}
    </ButtonGroup>
  );
}
