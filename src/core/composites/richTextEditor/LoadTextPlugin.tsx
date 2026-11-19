import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from "@lexical/markdown";
import { useEffect } from "react";
import { availableTransformers } from "@composites/RichTextEditor";

export function LoadTextPlugin({ text }: { text?: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const currentMarkdown = $convertToMarkdownString(availableTransformers);

      if (text !== undefined && text !== currentMarkdown) {
        $convertFromMarkdownString(text, availableTransformers);
      }
    });
  }, [text, editor]);

  return null;
}
