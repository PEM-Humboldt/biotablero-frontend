import {
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@ui/shadCN/lib/utils";

import type {
  CardInfoGrouped,
  InitiativeDataFormErr,
} from "pages/monitoring/types/initiativeData";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { EditModeButton } from "pages/monitoring/ui/initiativesAdmin/initiativeCard/EditModeButton";
import { ImagePreview } from "pages/monitoring/ui/initiativesAdmin/initiativeCard/ImagePreview";
import { ImagesInput } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/ImagesInput";
import { Button } from "@ui/shadCN/component/button";
import { uploadImages } from "pages/monitoring/api/services/assets";
import { uiText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";
import { useInitiativeDataCTX } from "pages/monitoring/ui/initiativesAdmin/hooks/useAdminUpdateContext";
import type { ImageUploadInfo } from "pages/monitoring/api/types/definitions";

export function ImagesUpdater({ title }: { title: string }) {
  const { initiative, updater, currentEdit, setCurrentEdit } =
    useInitiativeDataCTX();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<InitiativeDataFormErr>>({});
  const [forceRender, setForceRender] = useState(0);

  const sectionInfo = useRef<CardInfoGrouped["images"] | null>(null);
  const initiativeId = initiative?.id ?? null;
  const editThis = currentEdit === "images";

  const reset = useCallback(() => {
    sectionInfo.current = initiative ? { ...initiative.images } : null;
    setForceRender((n) => n + 1);
    setErrors({});
  }, [initiative]);

  useEffect(() => {
    reset();
  }, [reset]);

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isLoading || !sectionInfo.current || !initiativeId) {
      return;
    }

    setIsLoading(true);
    const imagesToUpload: ImageUploadInfo[] = [];

    if (sectionInfo.current.imageUrl instanceof File) {
      imagesToUpload.push({
        type: "image",
        action: "add",
        file: sectionInfo.current.imageUrl,
      });
    } else if (
      sectionInfo.current.imageUrl === null &&
      initiative?.images.imageUrl
    ) {
      imagesToUpload.push({
        type: "image",
        action: "remove",
      });
    }

    if (sectionInfo.current.bannerUrl instanceof File) {
      imagesToUpload.push({
        type: "banner",
        action: "add",
        file: sectionInfo.current.bannerUrl,
      });
    } else if (
      sectionInfo.current.bannerUrl === null &&
      initiative?.images.bannerUrl
    ) {
      imagesToUpload.push({
        type: "banner",
        action: "remove",
      });
    }

    const imageUploadErrors = await uploadImages(imagesToUpload, initiativeId);
    setIsLoading(false);

    if (imageUploadErrors?.length > 0) {
      setErrors((oldErr) => ({
        ...oldErr,
        images: { root: imageUploadErrors },
      }));
      return;
    }

    setForceRender((n) => n + 1);
    await updater!();
    setCurrentEdit!("none");
  };

  const undoChanges = () => {
    reset();
  };

  const updateInfo = useCallback((newInfo: CardInfoGrouped["images"]) => {
    sectionInfo.current = { ...sectionInfo.current, ...newInfo };
  }, []);

  const editPanelAction = () => {
    setCurrentEdit!((curEdit) => (curEdit === "images" ? "none" : "images"));
    reset();
  };

  return (
    <div
      className={cn(
        "p-2 rounded-lg",
        editThis ? "bg-muted outline-2 outline-primary" : "",
      )}
    >
      <div
        id={`${initiativeId}_images`}
        className="font-normal flex flex-wrap gap-2 text-primary items-center text-lg pb-1"
      >
        <h4 className="font-normal text-primary text-lg p-0! m-0!">{title}</h4>
        {currentEdit && (
          <EditModeButton state={editThis} setState={() => editPanelAction()} />
        )}
      </div>

      {!editThis ? (
        <div
          key={`preview_${forceRender}`}
          className="flex gap-x-8 gap-y-4 flex-wrap items-end *:flex-[1_1_350px]"
        >
          <ImagePreview
            title={uiText.initiative.module.images.imageUrl.title}
            imageUrl={sectionInfo.current?.imageUrl}
            altTxt={uiText.initiative.module.images.bannerUrl.alt}
            fallbackTxt={uiText.initiative.unasignedFallback}
          />
          <ImagePreview
            title={uiText.initiative.module.images.bannerUrl.title}
            imageUrl={sectionInfo.current?.bannerUrl}
            altTxt={uiText.initiative.module.images.bannerUrl.alt}
            fallbackTxt={uiText.initiative.unasignedFallback}
          />
        </div>
      ) : (
        <form aria-labelledby={`${initiativeId}_${"images"}`}>
          <ImagesInput
            key={`form_${forceRender}`}
            sectionInfo={sectionInfo.current!}
            sectionUpdater={updateInfo}
            validationErrorsObj={errors.images ?? {}}
          />

          <ErrorsList
            errorItems={errors.root ?? []}
            className="bg-red-50 p-6 mt-4 rounded-lg md:w-[50%] ml-auto outline-2 outline-accent self-end"
          />

          <div className="flex flex-row-reverse gap-2 justify-between mt-4">
            <Button
              disabled={isLoading}
              type="button"
              onClick={(e) => setTimeout(() => void handleSubmit(e), 0)}
              title={uiText.save}
            >
              {isLoading ? uiText.wait : uiText.save}
            </Button>
            <Button
              disabled={isLoading}
              type="button"
              variant="outline_destructive"
              onClick={() => undoChanges()}
            >
              {uiText.undo}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
