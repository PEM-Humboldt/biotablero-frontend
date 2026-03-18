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
  disableTerritoryStory,
  editTerritoryStoryGeneralInfo,
  enableTerritoryStory,
  getTerritoryStory,
} from "pages/monitoring/api/services/territoryStory";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import type { ApiRequestError } from "@appTypes/api";
import {
  deleteTerritoryStoryImage,
  deleteTerritoryStoryVideo,
  postTerritoryStoryImage,
  postTerritoryStoryVideo,
} from "pages/monitoring/api/services/assets";
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

export function makeApiResponseErrorObject(errors: ApiRequestError): FormError {
  return errors.data.reduce<FormError>((errObject, current) => {
    const key =
      current?.field && isFormErrorKey(current.field) ? current.field : "root";

    if (!errObject[key]) {
      errObject[key] = [];
    }

    errObject[key].push(current.msg);
    return errObject;
  }, {});
}

export function FormTS({ territoryStoryId }: { territoryStoryId?: number }) {
  const [formKey, setFormKey] = useState(0);
  const [story, setStory] = useState<TerritoryStoryForm>(initializeTSForm());
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormError>({});
  const textToPull = useRef<EditorState | null>(null);
  const { initiativeInfo } = useInitiativeCTX();
  const storyToUpdate = useRef<TerritoryStoryForm | null>(null);

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

  const fetchStoryData = useCallback(async () => {
    if (territoryStoryId === undefined) {
      setStory(initializeTSForm());
      return;
    }

    setIsLoading(true);
    const res = await getTerritoryStory(territoryStoryId);

    if (isMonitoringAPIError(res)) {
      const errorObject = makeApiResponseErrorObject(res);

      setErrors(errorObject);
      setIsLoading(false);
      return;
    }

    storyToUpdate.current = initializeTSForm(res);
    setStory(initializeTSForm(res));
    setIsLoading(false);
  }, [territoryStoryId]);

  useEffect(() => {
    void fetchStoryData();
  }, [fetchStoryData]);

  const handleSubmitImages = async (res: TerritoryStoryFull) => {
    const imagesUrls = new Set(story.images.map((img) => img.fileUrl));
    const imagesToAdd = story.images.filter((img) => img.file);
    const imagesToRemove = storyToUpdate.current
      ? storyToUpdate.current.images.filter(
          (img) => !imagesUrls.has(img.fileUrl) && img.id !== undefined,
        )
      : [];

    const removeImages = imagesToRemove.map((img) =>
      deleteTerritoryStoryImage(img.id!),
    );

    const postImages = imagesToAdd.map((img) =>
      postTerritoryStoryImage(res.id, img.description, img.file!),
    );

    const resRemoveImages = await Promise.all(removeImages);
    if (isMonitoringAPIError(resRemoveImages)) {
      return makeApiResponseErrorObject(resRemoveImages);
    }

    const resPostImages = await Promise.all(postImages);
    if (isMonitoringAPIError(resPostImages)) {
      return makeApiResponseErrorObject(resPostImages);
    }

    return null;
  };

  const handleSubmitVideos = async (res: TerritoryStoryFull) => {
    const videosUrlsInForm = new Set(story.videos.map((vid) => vid.fileUrl));
    const videosUrlsInStory = new Set(
      storyToUpdate.current
        ? storyToUpdate.current.videos.map((vid) => vid.fileUrl)
        : [],
    );
    const videosToRemove = storyToUpdate.current
      ? storyToUpdate.current.videos.filter(
          (vid) => !videosUrlsInForm.has(vid.fileUrl) && vid.id !== undefined,
        )
      : [];

    const videosToAdd = story.videos.filter(
      (vid) => !videosUrlsInStory.has(vid.fileUrl),
    );

    const removeVideos = videosToRemove.map((vid) =>
      deleteTerritoryStoryVideo(vid.id!),
    );

    const addVideos = videosToAdd.map((vid) =>
      postTerritoryStoryVideo(res.id, vid.fileUrl),
    );

    const resRemoveVideos = await Promise.all(removeVideos);
    if (isMonitoringAPIError(resRemoveVideos)) {
      return makeApiResponseErrorObject(resRemoveVideos);
    }

    const resPostVideos = await Promise.all(addVideos);
    if (isMonitoringAPIError(resPostVideos)) {
      return makeApiResponseErrorObject(resPostVideos);
    }

    return null;
  };

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
      enabled: territoryStoryId === undefined ? false : story.enabled,
      ...(keywords.length > 0 && { keywords }),
    };

    const res =
      territoryStoryId === undefined
        ? await createTerritoryStory(payload)
        : await editTerritoryStoryGeneralInfo(territoryStoryId, payload);

    if (isMonitoringAPIError(res)) {
      setErrors(makeApiResponseErrorObject(res));
      return;
    }

    const results = await Promise.all([
      handleSubmitImages(res),
      handleSubmitVideos(res),
    ]);

    const uploadErrors = results.reduce((all, current) => {
      if (current === null) {
        return all;
      }
      return { ...all, ...current };
    }, {} as FormError);

    if (uploadErrors && Object.keys(uploadErrors).length > 0) {
      setErrors(uploadErrors);
      return;
    }

    const resEnabledStatus = story.enabled
      ? await enableTerritoryStory(res.id)
      : await disableTerritoryStory(res.id);
    if (isMonitoringAPIError(resEnabledStatus)) {
      setErrors(makeApiResponseErrorObject(resEnabledStatus));
      return;
    }

    successToast(territoryStoryId === undefined, res.title);
  };

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormKey((oldKey) => oldKey + 1);
    await fetchStoryData();
  };

  if (!story.enabled) {
    return null;
  }

  return isLoading ? (
    <div>{uiText.loading}</div>
  ) : (
    <div className="p-8 pt-0 space-y-4">
      <h3>{territoryStoryId ? uiText.edit : uiText.create}</h3>

      <form
        key={formKey}
        onSubmit={(e) => void handleSubmit(e)}
        onReset={(e) => void handleReset(e)}
        className="w-full flex flex-col gap-3 lg:gap-6"
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
          submitErrors={errors.root ?? []}
          text={{ ...uiText.submitStory }}
        />
      </form>
    </div>
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
