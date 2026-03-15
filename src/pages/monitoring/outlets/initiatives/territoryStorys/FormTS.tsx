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
import { YoutubeVideoInput } from "pages/monitoring/outlets/initiatives/territoryStorys/formTS/YoutubeVideoInput";
import type {
  ImageObjectTS,
  TerritoryStoryForm,
  TerritoryStoryFull,
  VideoObjectTS,
} from "pages/monitoring/types/territoryStory";
import { ImagesInput } from "pages/monitoring/outlets/initiatives/territoryStorys/formTS/ImagesInput";
import {
  TERRITORY_STORY_KEYWORD_MAX_LENGTH,
  TERRITORY_STORY_KEYWORDS_MAX_AMOUNT,
} from "@config/monitoring";
import { TitleInput } from "pages/monitoring/outlets/initiatives/territoryStorys/formTS/TitleInput";
import { SubmitStory } from "pages/monitoring/outlets/initiatives/territoryStorys/formTS/SubmitStory";
import {
  createTerritoryStory,
  getTerritoryStory,
} from "pages/monitoring/api/services/territoryStory";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import type { ApiRequestError } from "@appTypes/api";
import { postTerritoryStoryImage } from "pages/monitoring/api/services/assets";
import { toast } from "sonner";
import { BookOpenCheck } from "lucide-react";
import type { RequestData } from "pages/monitoring/api/types/definitions";

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

// TODO: COnfirmar con César sobre la Capitalización de campos
const TS_ERROR_FIELDS = [
  "Keywords",
  "Images",
  "Videos",
  "Title",
  "Text",
] as const;

type TSErrorFields = (typeof TS_ERROR_FIELDS)[number];

type FormError = { [K in TSErrorFields]?: string[] } & {
  root?: string[];
};

function isFormErrorKey(key: string): key is TSErrorFields {
  return (TS_ERROR_FIELDS as readonly string[]).includes(key);
}

export function FormTS({ territoryStoryId }: { territoryStoryId?: number }) {
  const [formKey, setFormKey] = useState(0);
  const [story, setStory] = useState<TerritoryStoryForm>(initializeTSForm());
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormError>({});
  const textToPull = useRef<EditorState | null>(null);
  const { initiativeInfo } = useInitiativeCTX();

  const updateField = useCallback(
    <K extends keyof TerritoryStoryForm>(field: K) =>
      (value: TerritoryStoryForm[K]) => {
        setStory((oldData) => ({ ...oldData, [field]: value }));
      },
    [],
  );

  const updateError = useCallback(
    <K extends keyof FormError>(field: K) =>
      (value: string[]) => {
        setErrors((oldErrors) => ({
          ...oldErrors,
          [field]: value,
        }));
      },
    [],
  );

  const makeErrorObject = (errors: ApiRequestError): FormError => {
    return errors.data.reduce<FormError>((errObject, current) => {
      const key =
        current?.field && isFormErrorKey(current.field)
          ? current.field
          : "root";

      if (!errObject[key]) {
        errObject[key] = [];
      }

      errObject[key].push(current.msg);
      return errObject;
    }, {});
  };

  const fetchStoryData = useCallback(async () => {
    if (territoryStoryId === undefined) {
      setStory(initializeTSForm());
      return;
    }

    setIsLoading(true);
    const res = await getTerritoryStory(territoryStoryId);

    if (isMonitoringAPIError(res)) {
      const errorObject = makeErrorObject(res);

      setErrors(errorObject);
      setIsLoading(false);
      return;
    }

    setStory(initializeTSForm(res));
    setIsLoading(false);
  }, [territoryStoryId]);

  useEffect(() => {
    void fetchStoryData();
  }, [fetchStoryData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!initiativeInfo) {
      return;
    }

    const keywords = story.keywords.join(",");

    const payload: RequestData = {
      initiativeId: initiativeInfo.id,
      title: story.title,
      text: fromLexicalEditorStateRefToMarkdown(textToPull),
      restricted: story.restricted,
      enabled: story.enabled,
      ...(keywords.length > 0 && { keywords }),
      ...(story.videos.length > 0 && {
        videos: story.videos.map((v) => ({ fileUrl: v.fileUrl })),
      }),
    };

    const res = await createTerritoryStory(payload);
    if (isMonitoringAPIError(res)) {
      setErrors(makeErrorObject(res));
      return;
    }

    if (story.images.length === 0) {
      toast("Melo melo", {
        position: "bottom-right",
        description: `El relato '${res.title}' fue creado con éxito`,
        icon: <BookOpenCheck className="size-8 text-primary" />,
        className: "px-6! gap-6! border-2! border-primary!",
      });
      return;
    }

    const imagesToUpload = story.images
      .filter((img) => img.file !== undefined)
      .map((img) =>
        postTerritoryStoryImage(res.id, img.description, img.file!),
      );

    let uploadErrrors: string[] = [];
    const uploadedImages = await Promise.all(imagesToUpload);
    uploadedImages.forEach((img) => {
      if (isMonitoringAPIError(img)) {
        uploadErrrors = [...uploadErrrors, ...img.data.map((i) => i.msg)];
      }
    });

    if (uploadErrrors.length > 0) {
      setErrors({
        Images: uploadErrrors,
        root: [
          "El relato fue creado correctamente, pero sucedió un problema al subir las imágenes",
        ],
      });
    } else {
      setStory(initializeTSForm());
      toast("Melo melo caramelo", {
        position: "bottom-right",
        description: `El relato '${res.title}' fue creado con éxito`,
        icon: <BookOpenCheck className="size-8 text-primary" />,
        className: "px-6! gap-6! border-2! border-primary!",
      });
    }
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
      onSubmit={(e) => void handleSubmit(e)}
      onReset={(e) => void handleReset(e)}
      className="p-4 w-full max-w-[1200px] flex flex-col gap-2 bg-muted"
    >
      <h3>
        {territoryStoryId ? "Editar relato" : "Crear relato"} del territorio
      </h3>
      <TitleInput
        title={story.title}
        titleUpdater={updateField("title")}
        errors={errors.Title ?? []}
        setErrors={updateError("Title")}
      />

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
        errors={errors.Keywords ?? []}
        setErrors={updateError("Keywords")}
      />

      <ImagesInput
        images={story.images}
        updateImages={updateField("images")}
        errors={errors.Images ?? []}
        setErrors={updateError("Images")}
      />

      <YoutubeVideoInput
        videos={story.videos}
        updateVideos={updateField("videos")}
        errors={errors.Videos ?? []}
        setErrors={updateError("Videos")}
      />

      <SubmitStory
        restricted={story.restricted}
        setRestricted={updateField("restricted")}
        enabled={story.enabled}
        setEnabled={updateField("enabled")}
        submitErrors={errors.root ?? []}
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
