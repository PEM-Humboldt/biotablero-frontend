import {
  INITIATIVES_IMG_ALLOWED_FORMATS,
  TERRITORY_STORY_IMG_MAX_FILE_SIZE,
  TERRITORY_STORY_IMG_MAX_HEIGHT,
  TERRITORY_STORY_IMG_MAX_WIDTH,
  TERRITORY_STORY_IMG_MIN_HEIGHT,
  TERRITORY_STORY_IMG_MIN_WIDTH,
  TERRITORY_STORY_MAX_IMAGES,
} from "@config/monitoring";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import type { ImageObjectTS } from "pages/monitoring/types/territoryStory";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { cn } from "@ui/shadCN/lib/utils";
import { ImageUp, Trash, Trash2 } from "lucide-react";
import { Button } from "@ui/shadCN/component/button";
import { Input } from "@ui/shadCN/component/input";
import { ImgValidator } from "@utils/imgValidator";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";

export function ImagesInput({
  images,
  updateImages,
}: {
  images: ImageObjectTS[];
  updateImages: (images: ImageObjectTS[]) => void;
}) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageCards, setImageCards] = useState<ImageObjectTS[]>([]);

  const [stagedImage, setStagedImage] = useState<{
    file: File;
    preview: string;
    description: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const firstLoad = useRef(false);

  useEffect(() => {
    if (firstLoad.current) {
      return;
    }
    setImageCards(images);
    firstLoad.current = true;
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

    if (stagedImage.description.trim().length < 5) {
      setErrors(["La descripción debe tener al menos 5 caracteres."]);
      return;
    }

    if (imageCards.length >= TERRITORY_STORY_MAX_IMAGES) {
      setErrors(["Límite de imágenes alcanzado."]);
      return;
    }

    const newImage: ImageObjectTS = {
      fileUrl: stagedImage.preview,
      description: stagedImage.description,
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

  const handleUpdateDescription = (e: ChangeEvent<HTMLInputElement>) => {
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
    <div className="space-y-2">
      {imageCards.length > 0 && (
        <>
          <div className="text-primary px-2">Imágener adjuntas al relato</div>
          {imageCards.map((img, index) => (
            <ImageCard
              key={img.fileUrl}
              imageInfo={img}
              removeImage={() => removeImage(index)}
            />
          ))}
        </>
      )}

      <div>
        <LabelAndErrors
          htmlFor="imageUpload"
          errID="err_img"
          validationErrors={errors}
        >
          Cargar imagen para el relato
        </LabelAndErrors>

        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "relative group mt-1 overflow-hidden rounded-xl border border-primary border-dashed bg-white h-40 transition-all focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
              stagedImage
                ? "border-primary bg-muted"
                : "border-muted-foreground/30 hover:border-primary cursor-pointer",
            )}
          >
            <button
              type="button"
              className="absolute inset-0 w-full h-full cursor-pointer z-0 opacity-0"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Cargar imagen"
            />

            <div className="absolute inset-0 p-2 flex items-center justify-center pointer-events-none z-0">
              {stagedImage ? (
                <img
                  src={stagedImage.preview}
                  className="w-full h-full object-contain"
                  alt="Vista previa"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageUp className="w-16 h-16 opacity-30 text-primary" />
                  <span className="text-base text-primary">
                    Selecciona una imagen para subir
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
                  <span className="sr-only">Quitar imagen</span>
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            )}
          </div>

          <InputGroup className="py-5">
            <InputGroupInput
              placeholder="Escribe una breve descripción de la imagen..."
              value={stagedImage?.description ?? ""}
              type="text"
              onChange={handleUpdateDescription}
              disabled={!stagedImage}
            />
            <InputGroupButton
              size="sm"
              variant="ghost-clean"
              className="text-primary hover:text-accent"
              disabled={!stagedImage}
              onClick={handleAddStagedImage}
            >
              Subir imagen
            </InputGroupButton>
          </InputGroup>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          onChange={(e) => void handleFileSelect(e)}
          disabled={isLoading}
        />
        <div className="text-right">
          {imageCards.length} de {TERRITORY_STORY_MAX_IMAGES} imágenes
        </div>
      </div>
    </div>
  );
}

function ImageCard({
  imageInfo,
  removeImage,
}: {
  imageInfo: ImageObjectTS;
  removeImage: () => void;
}) {
  return (
    <div className="flex gap-2 p-2 rounded-lg border border-primary bg-muted space-y-2">
      <img
        src={imageInfo.fileUrl}
        alt={imageInfo.description}
        className="h-30 m-0! aspect-video object-cover rounded"
      />
      <div className="flex flex-col w-full gap-2 justify-between">
        <div>
          <span className="sr-only">
            descripcion para la imagen: ${imageInfo.description}
          </span>
          <span aria-hidden="true">{imageInfo.description}</span>
        </div>
        <Button
          onClick={() => removeImage()}
          size="icon-sm"
          variant="ghost"
          title="Borrar el video"
          type="button"
          className="self-end"
        >
          <span className="sr-only">Borrar</span>
          <Trash />
        </Button>
      </div>
    </div>
  );
}
