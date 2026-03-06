import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { type EditorState } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { MutableRefObject, useEffect, useRef } from "react";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode } from "@lexical/rich-text";
import { Button } from "@ui/shadCN/component/button";

import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";

import { inputTheme } from "./richTextEditor/inputTheme";
import { TextBlockSelector } from "./richTextEditor/TextBlockSelector";

function onError(error: Error) {
  console.error(error);
}

function GetEditorState({
  editorRef,
}: {
  editorRef: MutableRefObject<EditorState | null>;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      if (!editorRef) {
        return;
      }
      editorRef.current = editorState;
    });
  }, [editor, editorRef]);

  return null;
}

export function RichTextEditor() {
  const textRef = useRef<EditorState | null>(null);

  const initialConfig = {
    namespace: "relatosDelTerritorio",
    theme: inputTheme,
    onError,
    nodes: [HeadingNode, ListNode, ListItemNode],
  };

  const getMarkdown = () => {
    if (!textRef.current) {
      return;
    }

    const markdown = textRef.current.read(() =>
      $convertToMarkdownString(TRANSFORMERS),
    );

    console.log(markdown);
  };

  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative m-4 p-2 ">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-placeholder={"Escribe aquí tu relato..."}
                placeholder={
                  <div className="absolute left-0 top-0 m-6 text-primary/60">
                    Escribe aquí tu relato...
                  </div>
                }
                className="border w-[600px] h-[600px] p-4 rounded-lg"
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <TextBlockSelector />
          {/* <MarkdownShortcutPlugin transformers={TRANSFORMERS} /> */}
          <HistoryPlugin />
          <ListPlugin />
          <GetEditorState editorRef={textRef} />
          <AutoFocusPlugin />
        </div>
      </LexicalComposer>
      <Button onClick={() => getMarkdown()}>perrroooo </Button>
    </>
  );
}
