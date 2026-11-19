import { type MutableRefObject, useEffect } from "react";
import { type EditorState } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function GetEditorState({
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
