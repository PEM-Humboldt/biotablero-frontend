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
  type FormEvent,
} from "react";
import { KeywordInput } from "@composites/keywordInput";
import { YoutubeVideoInput } from "pages/monitoring/outlets/territoryStory/formTS/YoutubeVideoInput";
import type {
  ImageObjectTS,
  TerritoryStoryForm,
  TerritoryStoryFull,
  VideoObjectTS,
} from "pages/monitoring/types/territoryStory";
import { ImagesInput } from "pages/monitoring/outlets/territoryStory/formTS/ImagesInput";
import {
  TERRITORY_STORY_KEYWORD_MAX_LENGTH,
  TERRITORY_STORY_KEYWORDS_MAX_AMOUNT,
} from "@config/monitoring";
import { TitleInput } from "pages/monitoring/outlets/territoryStory/formTS/TitleInput";
import { SubmitStory } from "pages/monitoring/outlets/territoryStory/formTS/SubmitStory";
import { getTerritoryStory } from "pages/monitoring/api/services/territoryStory";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

const initializeTSForm = (
  territoryStory?: TerritoryStoryFull,
): TerritoryStoryForm => ({
  title: territoryStory?.title ?? "",
  text: territoryStory?.text ?? "",
  restricted: territoryStory?.restricted ?? false,
  enabled: territoryStory?.enabled ?? true,
  keywords: territoryStory?.keywords.split(",") ?? ([] as string[]),
  images: territoryStory?.images ?? ([] as ImageObjectTS[]),
  videos: territoryStory?.videos ?? ([] as VideoObjectTS[]),
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
  const [formKey, setFormKey] = useState(0);
  const [story, setStory] = useState<TerritoryStoryForm>(initializeTSForm());
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const textToPull = useRef<EditorState | null>(null);

  const updateField = useCallback(
    <K extends keyof TerritoryStoryForm>(field: K) =>
      (value: TerritoryStoryForm[K]) => {
        setStory((oldData) => ({ ...oldData, [field]: value }));
      },
    [],
  );

  const fetchStoryData = useCallback(async () => {
    if (territoryStoryId === undefined) {
      setStory(initializeTSForm());
      return;
    }

    setIsLoading(true);
    const res = await getTerritoryStory(territoryStoryId);

    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      setIsLoading(false);
      return;
    }

    setStory(initializeTSForm(res));
    setIsLoading(false);
  }, [territoryStoryId]);

  useEffect(() => {
    void fetchStoryData();
  }, [fetchStoryData]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.warn(
      "story",
      story,
      "text",
      fromLexicalEditorStateRefToMarkdown(textToPull),
    );
  };

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormKey((oldKey) => oldKey + 1);
    await fetchStoryData();
  };

  return isLoading ? (
    <div>Cargando...</div>
  ) : (
    <form
      key={formKey}
      onSubmit={handleSubmit}
      onReset={(e) => void handleReset(e)}
      className="p-4 w-full max-w-[1200px] flex flex-col gap-2 bg-muted"
    >
      <h3>
        {territoryStoryId ? "Editar relato" : "Crear relato"} del territorio
      </h3>
      <TitleInput title={story.title} titleUpdater={updateField("title")} />

      <div>
        <span className="text-primary font-normal">El relato</span>
        <RichTextEditor
          textToLoad={story.text}
          textStateRef={textToPull}
          placeholder="Mi relato..."
          className="bg-background"
        />
      </div>

      <KeywordInput
        keywordsList={story.keywords}
        updateKeywordsList={updateField("keywords")}
        keywordsLimit={TERRITORY_STORY_KEYWORDS_MAX_AMOUNT}
        keywordMaxLength={TERRITORY_STORY_KEYWORD_MAX_LENGTH}
        inputTxt={{
          label: "Palabras clave",
          placeholder: "agrega una palabra oprimiendo enter",
          sr: "agrega una palabra oprimiendo enter",
          keywordCounter: (currentAmount: number, total: number) =>
            `${currentAmount} de ${total} palabras clave`,
        }}
      />

      <ImagesInput images={story.images} updateImages={updateField("images")} />

      <YoutubeVideoInput
        videos={story.videos}
        updateVideos={updateField("videos")}
      />

      <SubmitStory
        restricted={story.restricted}
        setRestricted={updateField("restricted")}
        enabled={story.enabled}
        setEnabled={updateField("enabled")}
        submitErrors={errors}
      />
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
