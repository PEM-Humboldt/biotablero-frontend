import {
  RichTextEditor,
  availableTransformers,
} from "@composites/RichTextEditor";
import { $convertToMarkdownString } from "@lexical/markdown";
import { type EditorState } from "lexical";
import {
  type MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { KeywordInput } from "@composites/keywordInput";
import { YoutubeVideoInput } from "pages/monitoring/ui/YoutubeVideoInput";
import type {
  ImageObjectTS,
  TerritoryStoryForm,
  TerritoryStoryFull,
  VideoObjectTS,
} from "pages/monitoring/types/territoryStory";
import { getTerritoryStory } from "pages/monitoring/api/services/territoryStory";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

const initializeTSForm = (
  territoryStory?: TerritoryStoryFull,
): TerritoryStoryForm => ({
  title: territoryStory?.title ?? "",
  text: territoryStory?.text ?? "### carahjo\n[pendejo](mmejoa.com)",
  restricted: territoryStory?.restricted ?? false,
  enabled: territoryStory?.enabled ?? true,
  keywords:
    territoryStory?.keywords.split(",") ?? (["cara", "sello"] as string[]),
  images: territoryStory?.images ?? ([] as ImageObjectTS[]),
  videos:
    territoryStory?.videos ?? ([] as Omit<VideoObjectTS, "territoryStoryId">[]),
});

// async function saveVideoChanges(
//   territoryStoryId: number,
//   initialVideos: VideoObjectTS[], // Lo que vino de getTerritoryHistoryVideos
//   draftVideos: VideoDraft[], // El estado actual de tus tarjetas
// ) {
//   // 1. Identificar ELIMINACIONES
//   const draftDbIds = new Set(draftVideos.map((v) => v.dbId).filter(Boolean));
//   const toDelete = initialVideos.filter((v) => !draftDbIds.has(v.id));
//
//   // 2. Identificar CREACIONES
//   const toCreate = draftVideos.filter((v) => !v.dbId);
//
//   // 3. Ejecutar peticiones
//   const tasks: Promise<any>[] = [];
//
//   // Agregar eliminaciones
//   toDelete.forEach((v) => {
//     tasks.push(deleteTerritoryHistoryVideo(v.id));
//   });
//
//   // Agregar creaciones
//   toCreate.forEach((v) => {
//     tasks.push(postTerritoryHistoryVideo(territoryStoryId, v.url));
//   });
//
//   // Ejecutar todo en paralelo
//   const results = await Promise.allSettled(tasks);
//
//   return results;
// }

function fromLexicalEditorStateRefToMarkdown(
  textStateRef: MutableRefObject<EditorState | null>,
): string {
  if (!textStateRef.current) {
    return "";
  }

  const markdown = textStateRef.current.read(() =>
    $convertToMarkdownString(availableTransformers),
  );

  return markdown;
}

export function TerritoryStoryForm({
  territoryStoryId,
}: {
  territoryStoryId?: number;
}) {
  const [story, setStory] = useState<TerritoryStoryForm>(initializeTSForm());
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const textToPull = useRef(null);

  const updateField = useCallback(
    <K extends keyof TerritoryStoryForm>(field: K) =>
      (value: TerritoryStoryForm[K]) => {
        setStory((oldData) => ({ ...oldData, [field]: value }));
      },
    [],
  );

  const fetchStoryData = useCallback(async () => {
    if (territoryStoryId === undefined) {
      return;
    }

    setIsLoading(true);
    const res = await getTerritoryStory(territoryStoryId);

    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setStory(initializeTSForm(res));
  }, [territoryStoryId]);

  useEffect(() => {
    void fetchStoryData();
  }, [fetchStoryData]);

  const handleSubmit = () => {
    console.log(
      "text",
      fromLexicalEditorStateRefToMarkdown(textToPull),
      "palabras clave",
      story.keywords,
      "video",
      story.videos,
    );
  };

  return isLoading ? (
    <div>Cargando...</div>
  ) : (
    <>
      <RichTextEditor textToLoad={story.text} textStateRef={textToPull} />
      <KeywordInput
        keywordsList={story.keywords}
        updateKeywordsList={updateField("keywords")}
        keywordsLimit={5}
        inputTxt={{
          label: "Palabras clave del relato",
          placeholder: "agrega una palabra oprimiendo enter",
          sr: "agrega una palabra oprimiendo enter",
          keywordCounter: (currentAmount: number, total: number) =>
            `${currentAmount} de ${total} palabras clave`,
        }}
      />
      <YoutubeVideoInput videos={story.videos} />
      <button type="button" onClick={handleSubmit}>
        up
      </button>
    </>
  );
}
