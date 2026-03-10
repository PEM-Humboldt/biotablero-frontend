import {
  RichTextEditor,
  availableTransformers,
} from "@composites/RichTextEditor";
import { $convertToMarkdownString } from "@lexical/markdown";
import { type EditorState } from "lexical";
import { type ReactNode, useRef, useState } from "react";
import { Button } from "@ui/shadCN/component/button";
import { parseSimpleMarkdown } from "@utils/textParser";
import { KeywordInput } from "@composites/keywordInput";
import { YoutubeVideoInput } from "pages/monitoring/ui/YoutubeVideoInput";
import type { VideoObjectTS } from "pages/monitoring/types/territoryStory";

const preloadText = `
### Belcebú bendice este terminal

como va todo

[testea enlace](https://mmejia.com)

**bien o *no***
`;

export function Dashboard() {
  const textStateRef = useRef<EditorState | null>(null);
  const keywordsRef = useRef<string[] | null>(null);
  const VideosRef = useRef<VideoObjectTS[] | null>([
    { fileUrl: "https://www.youtube.com/watch?v=5sRh_WXw0WI" },
  ]);
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
      <KeywordInput listStateRef={keywordsRef} />
      <YoutubeVideoInput videosUrl={VideosRef} />
      <div>{a}</div>
    </>
  );
}
