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
import { YoutubeVideoInput } from "pages/monitoring/outlets/territoryStory/formTS/YoutubeVideoInput";
import type {
  ImageObjectTS,
  TerritoryStoryForm,
  TerritoryStoryFull,
  VideoObjectTS,
} from "pages/monitoring/types/territoryStory";
import { getTerritoryStory } from "pages/monitoring/api/services/territoryStory";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { ImagesInput } from "pages/monitoring/outlets/territoryStory/formTS/ImagesInput";
import {
  TERRITORY_STORY_KEYWORD_MAX_LENGTH,
  TERRITORY_STORY_KEYWORDS_MAX_AMOUNT,
  TERRITORY_STORY_TITLE_MAX_LENGTH,
} from "@config/monitoring";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { TitleInput } from "./formTS/TitleInput";

const initializeTSForm = (
  territoryStory?: TerritoryStoryFull,
): TerritoryStoryForm => ({
  title: territoryStory?.title ?? "",
  text: territoryStory?.text ?? "### carahjo\n[pendejo](mmejoa.com)",
  restricted: territoryStory?.restricted ?? false,
  enabled: territoryStory?.enabled ?? true,
  keywords:
    territoryStory?.keywords.split(",") ?? (["cara", "sello"] as string[]),
  images:
    territoryStory?.images ??
    ([
      {
        fileUrl:
          "https://notejoy.s3.amazonaws.com/static_images/notejoy_highlight_markdown.png",
        description: "pato pato ganso",
      },
    ] as ImageObjectTS[]),
  videos:
    territoryStory?.videos ??
    ([
      { fileUrl: "https://www.youtube.com/watch?v=W1tJ1GKmE4w" },
    ] as VideoObjectTS[]),
});

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
      "title",
      story.title,
      "text",
      fromLexicalEditorStateRefToMarkdown(textToPull),
      "palabras clave",
      story.keywords,
      "video",
      story.videos,
      "images",
      story.images,
    );
  };

  return isLoading ? (
    <div>Cargando...</div>
  ) : (
    <form className="p-4 w-full flex flex-col gap-2">
      <TitleInput title={story.title} titleUpdater={updateField("title")} />

      <RichTextEditor textToLoad={story.text} textStateRef={textToPull} />

      <KeywordInput
        keywordsList={story.keywords}
        updateKeywordsList={updateField("keywords")}
        keywordsLimit={TERRITORY_STORY_KEYWORDS_MAX_AMOUNT}
        keywordMaxLength={TERRITORY_STORY_KEYWORD_MAX_LENGTH}
        inputTxt={{
          label: "Palabras clave del relato",
          placeholder: "agrega una palabra oprimiendo enter",
          sr: "agrega una palabra oprimiendo enter",
          keywordCounter: (currentAmount: number, total: number) =>
            `${currentAmount} de ${total} palabras clave`,
        }}
      />

      <YoutubeVideoInput
        videos={story.videos}
        updateVideos={updateField("videos")}
      />

      <ImagesInput images={story.images} updateImages={updateField("images")} />

      <button type="button" onClick={handleSubmit}>
        up
      </button>
    </form>
  );
}

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
