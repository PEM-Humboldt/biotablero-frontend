import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { ImageUp, Trash, Star } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { cn } from "@ui/shadCN/lib/utils";
import { Button } from "@ui/shadCN/component/button";
import { InputGroup, InputGroupAddon } from "@ui/shadCN/component/input-group";
import { ImgValidator } from "@utils/imgValidator";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import { StrValidator } from "@utils/strValidator";
import {
  INITIATIVES_IMG_ALLOWED_FORMATS,
  TERRITORY_STORY_IMG_DESCRIPTION_MAX_LENGTH,
  TERRITORY_STORY_IMG_MAX_FILE_SIZE,
  TERRITORY_STORY_IMG_MAX_HEIGHT,
  TERRITORY_STORY_IMG_MAX_WIDTH,
  TERRITORY_STORY_IMG_MIN_HEIGHT,
  TERRITORY_STORY_IMG_MIN_WIDTH,
  TERRITORY_STORY_IMG_MAX_AMOUNT,
} from "@config/monitoring";

import type { ImageObjectTS } from "pages/monitoring/types/territoryStory";

type ImagesInputProps = {
  images: ImageObjectTS[];
  updateImages: (images: ImageObjectTS[]) => void;
  errors: string[];
  setErrors: (errors: string[]) => void;
  text: {
    title: string;
    counter: (current: number, total: number) => string;
    image: {
      input: string;
      inputBtnSR: string;
      inputLabel: string;
      inputPreviewAlt: string;
      removeSR: string;
    };
    description: {
      label: string;
    };
    add: string;
    imagesPool: {
      quotaReached: string;
      title: string;
      descriptionTitleSR: (description: string) => string;
      remove: { label: string; title: string; sr: string };
      feature: { label: string; title: string; sr: string };
    };
  };
};

export function ImagesInput({
  images,
  updateImages,
  errors,
  setErrors,
  text,
}: ImagesInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageCards, setImageCards] = useState<ImageObjectTS[]>([]);

  const [stagedImage, setStagedImage] = useState<{
    file: File;
    preview: string;
    description: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setImageCards(images);

    return () => {
      imageCards.forEach((img) => {
        if (img.fileUrl.startsWith("blob:")) {
          URL.revokeObjectURL(img.fileUrl);
        }
      });
    };
  }, [images, imageCards, stagedImage]);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target.files?.[0];
    if (!fileInput) {
      return;
    }
    setErrors([]);

    const imageToValidate = new ImgValidator(fileInput, setIsLoading);
    const [file, errors] = (
      await imageToValidate
        .isFormat(INITIATIVES_IMG_ALLOWED_FORMATS)
        .maxSize(TERRITORY_STORY_IMG_MAX_FILE_SIZE)
        .validateDimensions({
          minWidth: TERRITORY_STORY_IMG_MIN_WIDTH,
          maxWidth: TERRITORY_STORY_IMG_MAX_WIDTH,
          minHeight: TERRITORY_STORY_IMG_MIN_HEIGHT,
          maxHeight: TERRITORY_STORY_IMG_MAX_HEIGHT,
        })
    ).result;

    if (!file || errors.length > 0) {
      setErrors(errors);
      setStagedImage(null);
      return;
    }

    if (stagedImage?.preview) {
      URL.revokeObjectURL(stagedImage.preview);
    }

    setStagedImage({
      file,
      preview: URL.createObjectURL(fileInput),
      description: "",
    });
  };

  const handleAddStagedImage = () => {
    if (!stagedImage || !stagedImage?.file) {
      return;
    }

    const [cleanDescription, descriptionErrors] = new StrValidator(
      stagedImage.description,
    )
      .sanitize()
      .isRequired()
      .hasLengthLessOrEqualThan(
        TERRITORY_STORY_IMG_DESCRIPTION_MAX_LENGTH,
      ).result;

    if (descriptionErrors.length > 0) {
      setErrors(descriptionErrors.map((e) => `descripcion: ${e}`));
      return;
    }

    if (imageCards.length >= TERRITORY_STORY_IMG_MAX_AMOUNT) {
      setErrors([text.imagesPool.quotaReached]);
      return;
    }

    const newImage: ImageObjectTS = {
      fileUrl: stagedImage.preview,
      description: cleanDescription,
      file: stagedImage.file,
    };

    const updatedList = [...imageCards, newImage];
    setImageCards(updatedList);
    updateImages(updatedList);
    setErrors([]);
    setStagedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdateDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setErrors([]);
    setStagedImage((oldStaged) => {
      if (!oldStaged) {
        return oldStaged;
      }

      return {
        ...oldStaged,
        description: e.target.value,
      };
    });
  };

  const removeImage = (index: number) => {
    setErrors([]);

    const img = imageCards[index];
    if (img.fileUrl.startsWith("blob:")) {
      URL.revokeObjectURL(img.fileUrl);
    }

    const filtered = imageCards.filter((_, i) => i !== index);
    setImageCards(filtered);
    updateImages(filtered);
  };

  const featureImage = (index: number) => {
    const featured = imageCards.map((current, i) => {
      return {
        ...current,
        featuredContent: index === i && current.featuredContent !== true,
      };
    });

    setImageCards(featured);
    updateImages(featured);
  };

  return (
    <fieldset>
      <legend className="flex w-full justify-between text-primary font-normal px-2">
        <span>{text.title}</span>
        <span>
          {text.counter(imageCards.length, TERRITORY_STORY_IMG_MAX_AMOUNT)}
        </span>
      </legend>

      <div className="border border-input p-2 rounded-xl">
        <div>
          <LabelAndErrors
            htmlFor="imageUpload"
            errID="errors_img"
            validationErrors={errors}
            className="m-0 p-0"
          >
            <span className="sr-only">{text.image.input}</span>
          </LabelAndErrors>

          <div className="grid grid-cols-2 py-0.5 gap-4">
            <div
              className={cn(
                "relative group overflow-hidden rounded-xl border border-primary border-dashed bg-background min-h-40 h-full transition-all focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
                stagedImage
                  ? "border-primary bg-muted"
                  : "border-muted-foreground/30 hover:border-primary cursor-pointer",
              )}
            >
              <button
                type="button"
                className="absolute inset-0 w-full h-full cursor-pointer z-0 opacity-0"
                onClick={() => fileInputRef.current?.click()}
                aria-label={text.image.inputBtnSR}
              />

              <div className="absolute inset-0 p-2 flex items-center justify-center pointer-events-none z-0">
                {stagedImage ? (
                  <img
                    src={stagedImage.preview}
                    className="w-full h-full object-contain"
                    alt={text.image.inputPreviewAlt}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageUp className="w-16 h-16 opacity-30 text-primary" />
                    <span className="text-base text-primary">
                      {text.image.inputLabel}
                    </span>
                  </div>
                )}
              </div>

              {stagedImage && (
                <div className="absolute bottom-3 right-3 flex gap-2 z-10">
                  <Button
                    type="button"
                    variant="outline_destructive"
                    className="bg-white shadow-md h-9 w-9"
                    onClick={() => {
                      URL.revokeObjectURL(stagedImage.preview);
                      setStagedImage(null);
                    }}
                  >
                    <span className="sr-only">{text.image.removeSR}</span>
                    <Trash aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col mt-1">
              <label
                htmlFor="image_description"
                className="text-primary font-normal"
              >
                {text.description.label} <span aria-hidden="true">*</span>
              </label>
              <InputGroup className="h-full rounded-lg">
                <TextareaAutosize
                  id="image_description"
                  name="image_description"
                  data-slot="input-group-control"
                  placeholder="Escribe una breve descripción de la imagen..."
                  className="field-sizing-content min-h-20 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none"
                  value={stagedImage?.description ?? ""}
                  onChange={handleUpdateDescription}
                  maxLength={TERRITORY_STORY_IMG_DESCRIPTION_MAX_LENGTH}
                  disabled={!stagedImage}
                  aria-required="true"
                  aria-describedby={
                    errors.length > 0 ? "errors_img" : undefined
                  }
                />
                <InputGroupAddon
                  align="block-end"
                  className={cn(
                    "mt-0 pt-0",
                    inputWarnColor(
                      stagedImage?.description ?? "",
                      TERRITORY_STORY_IMG_DESCRIPTION_MAX_LENGTH,
                    ),
                  )}
                >
                  {inputLengthCount(
                    stagedImage?.description ?? "",
                    TERRITORY_STORY_IMG_DESCRIPTION_MAX_LENGTH,
                  )}
                </InputGroupAddon>
              </InputGroup>

              <Button
                size="sm"
                variant="default"
                className="mt-2 self-end"
                disabled={!stagedImage}
                onClick={handleAddStagedImage}
              >
                {text.add}
              </Button>
            </div>
          </div>
        </div>

        {imageCards.length > 0 && (
          <>
            <div className="flex w-full justify-between text-primary font-normal px-2 mt-2">
              {text.imagesPool.title}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {imageCards.map((img, index) => (
                <ImageCard
                  key={img.fileUrl}
                  imageInfo={img}
                  featureImage={() => featureImage(index)}
                  removeImage={() => removeImage(index)}
                  text={{ ...text.imagesPool }}
                />
              ))}
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          onChange={(e) => void handleFileSelect(e)}
          disabled={isLoading}
          aria-describedby={errors.length > 0 ? "errors_img" : undefined}
        />
      </div>
    </fieldset>
  );
}

function ImageCard({
  imageInfo,
  removeImage,
  featureImage,
  text,
}: {
  imageInfo: ImageObjectTS;
  removeImage: () => void;
  featureImage: () => void;
  text: {
    descriptionTitleSR: (description: string) => string;
    remove: { label: string; title: string; sr: string };
    feature: { label: string; title: string; sr: string };
  };
}) {
  return (
    <div className="flex gap-2 p-2 rounded-lg bg-background/50 transition-all duration-300 ease-in-out hover:outline hover:outline-primary hover:bg-background">
      <div className="relative flex-1">
        <img
          src={imageInfo.fileUrl}
          alt={imageInfo.description}
          className="border border-primary/50 h-30 w-full object-cover rounded"
        />

        <Button
          onClick={() => featureImage()}
          size={text.feature.label === "" ? "icon-sm" : "sm"}
          variant="outline"
          title={text.feature.title}
          type="button"
          className="absolute bottom-2 right-2"
        >
          <span className="sr-only">{text.feature.sr}</span>
          <span aria-hidden="true" className="flex gap-2 items-center">
            {text.feature.label !== "" && text.feature.label}
            <Star
              className={cn(
                "size-4",
                imageInfo?.featuredContent ? "fill-primary" : "",
              )}
            />
          </span>
        </Button>
      </div>
      <div className="flex-1 flex flex-col w-full gap-2 justify-between">
        <div>
          <span className="sr-only">
            {text.descriptionTitleSR(imageInfo.description)}
          </span>
          <span aria-hidden="true">{imageInfo.description}</span>
        </div>
        <Button
          onClick={() => removeImage()}
          size={text.remove.label === "" ? "icon-sm" : "sm"}
          variant="outline_destructive"
          title={text.remove.title}
          type="button"
          className="self-end"
        >
          <span className="sr-only">{text.remove.sr}</span>
          <span aria-hidden="true" className="flex gap-2">
            {text.feature.label !== "" && text.remove.label}
            <Trash />
          </span>
        </Button>
      </div>
    </div>
  );
}
