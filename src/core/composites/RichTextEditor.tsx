import { type MutableRefObject } from "react";
import { type EditorState } from "lexical";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import {
  $convertFromMarkdownString,
  type Transformer,
  UNORDERED_LIST,
  HEADING,
  ORDERED_LIST,
  QUOTE,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
} from "@lexical/markdown";

import { inputTheme } from "@composites/richTextEditor/inputTheme";
import { CustomShortcuts } from "@composites/richTextEditor/CustomShortcuts";
import { Toolbar } from "@composites/richTextEditor/Toolbar";
import { GetEditorState } from "@composites/richTextEditor/GetEditorState";

export const availableTransformers: Transformer[] = [
  UNORDERED_LIST,
  HEADING,
  ORDERED_LIST,
  QUOTE,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
];

export function RichTextEditor({
  textToLoad,
  textStateRef,
}: {
  textToLoad?: string;
  textStateRef: MutableRefObject<EditorState | null>;
}) {
  const initialConfig = {
    namespace: "relatosDelTerritorio",
    theme: inputTheme,
    onError: (err: Error) => console.error("Lexical:", err),
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode],
    editorState: () =>
      textToLoad
        ? $convertFromMarkdownString(textToLoad, availableTransformers)
        : undefined,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border self-start border-primary/50 focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2 m-4 p-2 rounded-lg">
        <Toolbar />
        <div className="relative ">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-placeholder={"Escribe aquí tu relato..."}
                placeholder={
                  <div className="absolute left-0 top-0 m-4 text-primary/60">
                    Escribe aquí tu relato...
                  </div>
                }
                className="mt-2 p-4 focus-within:outline-none"
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <MarkdownShortcutPlugin transformers={availableTransformers} />
          <HistoryPlugin />
          <CustomShortcuts />
          <ListPlugin />
          <LinkPlugin />
          <GetEditorState editorRef={textStateRef} />
          <AutoFocusPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
