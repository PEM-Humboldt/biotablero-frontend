import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import {
  $createHeadingNode,
  $isHeadingNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { NativeSelect } from "@ui/shadCN/component/native-select";
import { NativeSelectOption } from "@ui/shadCN/component/native-select";

const blockTypes: Map<HeadingTagType | "p", string> = new Map([
  ["p", "Párrafo"],
  ["h3", "Subtítulo nivel 1"], // Arrancamos por h3, pues h1 y h2 ya están tomados
  ["h4", "Subtítulo nivel 2"],
  ["h5", "Subtítulo nivel 3"],
  ["h6", "Subtítulo nivel 4"],
]);

export function TextBlockSelector() {
  const [blockType, setBlockType] = useState<string>("p");
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
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
        }
      });
    });
  }, [editor]);

  const updateHeading = (tag: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (tag === "p") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () =>
            $createHeadingNode(tag as HeadingTagType),
          );
        }
      }
    });
  };

  return (
    <NativeSelect
      value={blockType}
      onChange={(e) => updateHeading(e.target.value)}
    >
      {Array.from(blockTypes).map(([value, label]) => (
        <NativeSelectOption value={value} key={value}>
          {label}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
