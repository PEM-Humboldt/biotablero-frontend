import { useState, type MutableRefObject } from "react";
import { $getRoot, type EditorState } from "lexical";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import {
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
import { uiText } from "@composites/richTextEditor/layout/uiTextAndSettings";
import { LoadTextPlugin } from "@composites/richTextEditor/LoadTextPlugin";
import { cn } from "@ui/shadCN/lib/utils";
import { inputWarnColor } from "@utils/ui";

const editorTransformers: Transformer[] = [
  UNORDERED_LIST,
  ORDERED_LIST,
  QUOTE,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
];

export const availableTransformers: Transformer[] = [
  ...editorTransformers,
  HEADING,
  LINK,
];

export function RichTextEditor({
  textToLoad,
  textStateRef,
  editorNamespace,
  placeholder,
  className,
  id,
  onBlur,
  onChange,
  describedBy,
  counter,
  maxLength = 10_000,
}: {
  textToLoad?: string;
  textStateRef: MutableRefObject<EditorState | null>;
  editorNamespace?: string;
  placeholder?: string;
  className?: string;
  onBlur?: () => void;
  onChange?: () => void;
  id?: string;
  describedBy?: string;
  counter?: boolean;
  maxLength?: number;
}) {
  const [textLength, setTextLength] = useState(0);
  const initialConfig = {
    namespace: editorNamespace || "richTextEditor",
    theme: inputTheme,
    onError: (err: Error) => console.error("Lexical:", err),
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode],
  };

  const handleOnChange = (editorState: EditorState) => {
    if (onChange) {
      onChange();
    }
    if (counter) {
      const getTextLength = editorState.read(() =>
        $getRoot().getTextContentSize(),
      );

      setTextLength(getTextLength);
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={cn(
          "w-full border self-start border-input focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2 p-2 rounded-lg",
          className,
        )}
      >
        <Toolbar />
        <div className="relative ">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                id={id}
                onBlur={onBlur}
                aria-placeholder={placeholder || uiText.placeholderDefault}
                placeholder={
                  <div className="absolute left-0 top-0 m-4 text-primary/60">
                    {placeholder || uiText.placeholderDefault}
                  </div>
                }
                aria-describedby={describedBy}
                className="mt-2 p-4 focus-within:outline-none"
                maxLength={maxLength}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        {counter && (
          <div
            className={cn(
              "flex justify-end px-2",
              inputWarnColor(textLength, maxLength),
            )}
          >
            {textLength} / {maxLength}
          </div>
        )}
      </div>
      <ListPlugin />
      <LinkPlugin />
      <HistoryPlugin />
      <CustomShortcuts />
      <AutoFocusPlugin />
      <OnChangePlugin onChange={handleOnChange} />
      <MarkdownShortcutPlugin transformers={editorTransformers} />
      <LoadTextPlugin text={textToLoad} />
      <GetEditorState editorRef={textStateRef} />
    </LexicalComposer>
  );
}
