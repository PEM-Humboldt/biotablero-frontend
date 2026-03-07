import { useEffect, useState } from "react";
import { MessageSquareQuote, Link } from "lucide-react";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";

import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isQuoteNode, $createQuoteNode } from "@lexical/rich-text";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";

import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";

const structureModifications = {
  quote: { label: "Insertar cita", icon: MessageSquareQuote },
  link: { label: "Insertar enlace", icon: Link },
};

export function TextStructureSelector() {
  const [editor] = useLexicalComposerContext();
  const [isQuote, setIsQuote] = useState(false);
  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const element = selection.anchor
            .getNode()
            .getTopLevelElementOrThrow();
          setIsQuote($isQuoteNode(element));

          const nodes = selection.getNodes();
          setIsLink(
            nodes.some(
              (node) => $isLinkNode(node) || $isLinkNode(node.getParent()),
            ),
          );
        }
      });
    });
  }, [editor]);

  const toggleQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (isQuote) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      }
    });
  };

  const toggleLink = () => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      const url = window.prompt("Introduce la URL:");
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    }
  };

  return (
    <ButtonGroup>
      <Button
        variant={isLink ? "default" : "outline"}
        size="icon"
        onClick={toggleLink}
        title={structureModifications.link.label}
      >
        <structureModifications.link.icon className="size-4" />
      </Button>

      <Button
        variant={isLink ? "default" : "outline"}
        size="icon"
        onClick={toggleQuote}
        title={structureModifications.quote.label}
      >
        <structureModifications.quote.icon className="size-4" />
      </Button>
    </ButtonGroup>
  );
}
