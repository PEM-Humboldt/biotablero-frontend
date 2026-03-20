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
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import type { ImageObjectTS } from "pages/monitoring/types/territoryStory";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { cn } from "@ui/shadCN/lib/utils";
import { ImageUp, Trash, Trash2 } from "lucide-react";
import { Button } from "@ui/shadCN/component/button";
import { ImgValidator } from "@utils/imgValidator";
import { InputGroup, InputGroupAddon } from "@ui/shadCN/component/input-group";
import TextareaAutosize from "react-textarea-autosize";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import { StrValidator } from "@utils/strValidator";

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
      descriptionTileSR: (description: string) => string;
      removeTitle: string;
      removeSR: string;
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
  }, [images]);

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

    // TODO: Validation STR
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
    const filtered = imageCards.filter((_, i) => i !== index);
    setImageCards(filtered);
    updateImages(filtered);
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
                "relative group overflow-hidden rounded-xl border border-primary border-dashed bg-white min-h-40 h-full transition-all focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
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
                    onClick={() => setStagedImage(null)}
                  >
                    <span className="sr-only">{text.image.removeSR}</span>
                    <Trash2 aria-hidden="true" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {imageCards.map((img, index) => (
                <ImageCard
                  key={img.fileUrl}
                  imageInfo={img}
                  removeImage={() => removeImage(index)}
                  text={{
                    descriptionTitleSR: text.imagesPool.descriptionTileSR,
                    removeTitle: text.imagesPool.removeTitle,
                    removeSR: text.imagesPool.removeSR,
                  }}
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
  text,
}: {
  imageInfo: ImageObjectTS;
  removeImage: () => void;
  text: {
    descriptionTitleSR: (description: string) => string;
    removeTitle: string;
    removeSR: string;
  };
}) {
  return (
    <div className="flex gap-2 p-2 rounded-lg bg-background/50 space-y-2">
      <img
        src={imageInfo.fileUrl}
        alt={imageInfo.description}
        className="border border-primary/50 h-30 object-contain rounded"
      />
      <div className="flex flex-col w-full gap-2 justify-between">
        <div>
          <span className="sr-only">
            {text.descriptionTitleSR(imageInfo.description)}
          </span>
          <span aria-hidden="true">{imageInfo.description}</span>
        </div>
        <Button
          onClick={() => removeImage()}
          size="icon-sm"
          variant="ghost"
          title={text.removeTitle}
          type="button"
          className="self-end"
        >
          <span className="sr-only">{text.removeSR}</span>
          <Trash />
        </Button>
      </div>
    </div>
  );
}
