import { useEffect, useState } from "react";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $isHeadingNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { NativeSelect } from "@ui/shadCN/component/native-select";
import { NativeSelectOption } from "@ui/shadCN/component/native-select";
import { blockTypes } from "@composites/richTextEditor/layout/uiTextAndSettings";

export function TextBlockSelector() {
  const [blockType, setBlockType] = useState<string>("p");
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }

        const anchorNode = selection.anchor.getNode();
        const element =
          anchorNode.getKey() === "root"
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();

        if ($isHeadingNode(element)) {
          setBlockType(element.getTag());
        } else {
          setBlockType("p");
        }
      });
    });
  }, [editor]);

  const updateHeading = (tag: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }

      if (tag === "p") {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () =>
          $createHeadingNode(tag as HeadingTagType),
        );
      }
    });
  };

  return (
    <NativeSelect
      value={blockType}
      onChange={(e) => updateHeading(e.target.value)}
      className="border-primary bg-background"
    >
      {Array.from(blockTypes).map(([value, label]) => (
        <NativeSelectOption value={value} key={value}>
          {label}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
