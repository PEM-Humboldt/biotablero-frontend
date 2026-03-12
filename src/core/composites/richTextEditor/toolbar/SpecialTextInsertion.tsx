import { useEffect, useState } from "react";
import {} from "lucide-react";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootNode,
} from "lexical";

import { $isLinkNode } from "@lexical/link";
import { $isQuoteNode, $createQuoteNode } from "@lexical/rich-text";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";

import { Button } from "@ui/shadCN/component/button";
import { ButtonGroup } from "@ui/shadCN/component/button-group";
import { structureModifications } from "@composites/richTextEditor/layout/uiTextAndSettings";
import { InsertUrlDialog } from "@composites/richTextEditor/toolbar/specialTextInsertion/InsertUrlDialog";

export function SpecialTextInsertion() {
  const [editor] = useLexicalComposerContext();
  const [isQuote, setIsQuote] = useState(false);
  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();

          const element = anchorNode.getTopLevelElement();

          if (element !== null && !$isRootNode(element)) {
            setIsQuote($isQuoteNode(element));
          } else {
            setIsQuote(false);
          }

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

  return (
    <ButtonGroup>
      <InsertUrlDialog
        trigger={
          <Button
            variant={isLink ? "default" : "outline"}
            size="icon"
            title={structureModifications.link.label}
          >
            <structureModifications.link.icon className="size-4" />
          </Button>
        }
      />

      <Button
        variant={isQuote ? "default" : "outline"}
        size="icon"
        onClick={toggleQuote}
        title={structureModifications.quote.label}
      >
        <structureModifications.quote.icon className="size-4" />
      </Button>
    </ButtonGroup>
  );
}
