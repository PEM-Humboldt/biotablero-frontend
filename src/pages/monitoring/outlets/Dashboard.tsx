import {
  RichTextEditor,
  availableTransformers,
} from "@composites/RichTextEditor";
import { $convertToMarkdownString } from "@lexical/markdown";
import { type EditorState } from "lexical";
import { type ReactNode, useRef, useState } from "react";
import { Button } from "@ui/shadCN/component/button";
import { parseSimpleMarkdown } from "@utils/textParser";

const preloadText = `
### entonces careverga

como va todo

[pendejo](https://mmejia.com)

**bien o *no***
`;

export function Dashboard() {
  const textStateRef = useRef<EditorState | null>(null);
  const [a, setA] = useState<ReactNode>();
  // const [b, setB] = useState();

  const getMarkdown = () => {
    if (!textStateRef.current) {
      return;
    }

    const markdown = textStateRef.current.read(() =>
      $convertToMarkdownString(availableTransformers),
    );

    setA(parseSimpleMarkdown(markdown));
  };

  return (
    <>
      <RichTextEditor textToLoad={preloadText} textStateRef={textStateRef} />
      <Button onClick={getMarkdown}>get</Button>
      <div>{a}</div>
    </>
  );
}
