import { availableTransformers } from "@composites/RichTextEditor";
import { type EditorState } from "lexical";
import {
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
import { TextEditor } from "pages/monitoring/outlets/initiatives/territoryStorys/formTS/TextEditor";
import { fromLexicalEditorStateRefToMarkdown } from "@utils/textParser";
import { uiText } from "pages/monitoring/outlets/initiatives/territoryStorys/formTS/layout/uiText";

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
      text: fromLexicalEditorStateRefToMarkdown(
        textToPull,
        availableTransformers,
      ),
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
      successToast(territoryStoryId === undefined, story.title);
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
        root: [uiText.errors.createdButErrImageUpload],
      });
    } else {
      setStory(initializeTSForm());
      successToast(territoryStoryId === undefined, story.title);
    }
  };

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormKey((oldKey) => oldKey + 1);
    await fetchStoryData();
  };

  return isLoading ? (
    <div>{uiText.loading}</div>
  ) : (
    <main className="page-main">
      <header>
        <h3>{territoryStoryId ? uiText.edit : uiText.create}</h3>
      </header>

      <form
        key={formKey}
        onSubmit={(e) => void handleSubmit(e)}
        onReset={(e) => void handleReset(e)}
        className="w-full flex flex-col gap-3 lg:gap-6 p-6"
      >
        <TitleInput
          title={story.title}
          titleUpdater={updateField("title")}
          text={{ ...uiText.titleInput }}
          errors={errors.Title ?? []}
          setErrors={updateError("Title")}
        />

        <TextEditor
          textToLoad={story.text}
          textStateRef={textToPull}
          className="bg-background"
          text={{ ...uiText.textEditor }}
          errors={errors.Text ?? []}
          setErrors={updateError("Text")}
        />

        <KeywordInput
          keywordsList={story.keywords}
          updateKeywordsList={updateField("keywords")}
          keywordsLimit={TERRITORY_STORY_KEYWORDS_MAX_AMOUNT}
          keywordMaxLength={TERRITORY_STORY_KEYWORD_MAX_LENGTH}
          separators={[" ", ",", "\n"]}
          keywordRefinement={(kw) =>
            `${kw.charAt(0).toLocaleUpperCase()}${kw.slice(1)}`
          }
          inputTxt={{ ...uiText.keywords }}
          errors={errors.Keywords ?? []}
          setErrors={updateError("Keywords")}
        />

        <ImagesInput
          images={story.images}
          updateImages={updateField("images")}
          errors={errors.Images ?? []}
          setErrors={updateError("Images")}
          text={{ ...uiText.imagesInput }}
        />

        <YoutubeVideoInput
          videos={story.videos}
          updateVideos={updateField("videos")}
          errors={errors.Videos ?? []}
          setErrors={updateError("Videos")}
          text={{ ...uiText.videosInput }}
        />

        <SubmitStory
          restricted={story.restricted}
          setRestricted={updateField("restricted")}
          enabled={story.enabled}
          setEnabled={updateField("enabled")}
          submitErrors={errors.root ?? []}
          text={{ ...uiText.submitStory }}
        />
      </form>
    </main>
  );
}

function successToast(itsNewStory: boolean, storyName: string) {
  const text = itsNewStory ? uiText.toast.creation : uiText.toast.update;
  toast(text.title, {
    position: "bottom-right",
    description: text.description(storyName),
    icon: <BookOpenCheck className="size-8 text-primary" />,
    className: "px-6! gap-6! border-2! border-primary!",
  });
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
