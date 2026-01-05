import { cn } from "@ui/shadCN/lib/utils";
import {
  type ChangeEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  ImagesData,
  InitiativeDataFormErr,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { LabelAndErrors, LegendAndErrors } from "@ui/LabelingWithErrors";
import type { ImageMimeType } from "@appTypes/formats";
import { ImgValidator } from "@utils/imgValidator";
import { Button } from "@ui/shadCN/component/button";

const INITIATIVES_IMG_ALLOWED_FORMATS: ImageMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function FormImagesInfo({
  title,
  sectionInfo,
  sectionUpdater,
  validationErrorsObj = {},
}: {
  title: string;
  sectionInfo: ImagesData;
  sectionUpdater: (value: ImagesData) => void;
  validationErrorsObj: Partial<InitiativeDataFormErr["images"]>;
}) {
  const [imagesInfo, setImagesInfo] = useState<ImagesData>({
    imageUrl: sectionInfo.imageUrl ?? null,
    bannerUrl: sectionInfo.bannerUrl ?? null,
  });
  const [imagesPreview, setImagesPreview] = useState<{
    imageUrl: string | null;
    bannerUrl: string | null;
  }>({ imageUrl: null, bannerUrl: null });
  const [inputErr, setInputErr] = useState<
    Partial<InitiativeDataFormErr["images"]>
  >({});

  const imageUrlRef = useRef(null);
  const bannerUrlRef = useRef(null);

  useEffect(() => {
    const infoClean = Object.fromEntries(
      Object.entries(imagesInfo).filter(([_, value]) => Boolean(value)),
    );
    sectionUpdater(infoClean);
  }, [imagesInfo, sectionUpdater]);

  const handleOnChangeImage =
    (
      image: keyof ImagesData,
      validation: (v: ImgValidator) => Promise<ImgValidator> | ImgValidator,
    ) =>
    async (e: ChangeEvent<HTMLInputElement>) => {
      const fileInput = e.target.files?.[0] ?? null;
      if (!fileInput) {
        return;
      }

      const imageToValidate = new ImgValidator(fileInput);
      const validatedImg = await validation(imageToValidate);
      const [file, errors] = validatedImg.result;

      if (imagesPreview[image]) {
        URL.revokeObjectURL(imagesPreview[image]);
      }

      if (errors.length > 0 || file === null) {
        setInputErr((oldErr) => ({ ...oldErr, [image]: errors }));
        setImagesPreview((oldImg) => ({ ...oldImg, [image]: null }));
        setImagesInfo((oldImg) => ({ ...oldImg, [image]: null }));
        return;
      }

      const imgUrl = URL.createObjectURL(file);
      setInputErr(({ [image]: _, ...oldErr }) => oldErr);
      setImagesPreview((oldImg) => ({ ...oldImg, [image]: imgUrl }));
      setImagesInfo((oldImg) => ({ ...oldImg, [image]: file }));
    };

  const handleRemoveImage = (
    image: keyof ImagesData,
    ref: RefObject<HTMLInputElement>,
  ) => {
    if (imagesPreview[image]) {
      URL.revokeObjectURL(imagesPreview[image]);
    }

    setImagesPreview((prev) => ({ ...prev, [image]: null }));
    setImagesInfo((prev) => ({ ...prev, [image]: null }));
    setInputErr(({ [image]: _, ...prev }) => ({ ...prev }));

    if (ref.current) {
      ref.current.value = "";
    }
  };

  const onChangeImageUrl = handleOnChangeImage(
    "imageUrl",
    (validations: ImgValidator) =>
      validations
        .maxSize(1)
        .isFormat(INITIATIVES_IMG_ALLOWED_FORMATS)
        .validateDimensions({ maxWidth: 800 }),
  );

  const onChangeBannerUrl = handleOnChangeImage(
    "bannerUrl",
    (validations: ImgValidator) =>
      validations
        .maxSize(1)
        .isFormat(INITIATIVES_IMG_ALLOWED_FORMATS)
        .validateDimensions({ maxWidth: 800 }),
  );

  return (
    <fieldset
      className={cn(
        "rounded-lg flex flex-col gap-2 p-4 ",
        Object.keys(inputErr).length > 0
          ? "bg-red-50 outline-2 outline-accent"
          : "bg-muted",
      )}
    >
      <LegendAndErrors>{title}</LegendAndErrors>

      <div className="flex gap-2 items-end *:flex-1">
        <div>
          <LabelAndErrors
            htmlFor="imageUrl"
            errID="errors_imageUrl"
            validationErrors={inputErr.imageUrl ?? []}
          >
            <span className="sr-only">
              Selecciona una imagen para la iniciativa
            </span>
          </LabelAndErrors>

          <input
            ref={imageUrlRef}
            name="imageUrl"
            id="imageUrl"
            type="file"
            className="hidden"
            accept={INITIATIVES_IMG_ALLOWED_FORMATS.join(", ")}
            onChange={(e) => void onChangeImageUrl(e)}
            aria-invalid={inputErr.imageUrl !== undefined}
            aria-describedby={inputErr.imageUrl ? "errors_imageUrl" : undefined}
          />

          <ImagePreview imgUrl={imagesPreview.imageUrl} />

          <SetImageButtons
            imgLabel="imagen"
            imgName="imageUrl"
            imgUrl={imagesPreview.imageUrl}
            inputRef={imageUrlRef}
            removeHandler={handleRemoveImage}
          />
        </div>

        <div>
          <LabelAndErrors
            htmlFor="bannerUrl"
            errID="errors_bannerUrl"
            validationErrors={inputErr.bannerUrl ?? []}
          >
            <span className="sr-only">
              Selecciona una imagen para la iniciativa
            </span>
          </LabelAndErrors>

          <input
            ref={bannerUrlRef}
            name="bannerUrl"
            id="bannerUrl"
            type="file"
            className="hidden"
            accept={INITIATIVES_IMG_ALLOWED_FORMATS.join(", ")}
            onChange={(e) => void onChangeBannerUrl(e)}
            aria-invalid={inputErr.bannerUrl !== undefined}
            aria-describedby={
              inputErr.bannerUrl ? "errors_bannerUrl" : undefined
            }
          />

          <ImagePreview imgUrl={imagesPreview.bannerUrl} />

          <SetImageButtons
            imgLabel="banner"
            imgName="bannerUrl"
            imgUrl={imagesPreview.bannerUrl}
            inputRef={bannerUrlRef}
            removeHandler={handleRemoveImage}
          />
        </div>
      </div>
    </fieldset>
  );
}

function ImagePreview({ imgUrl }: { imgUrl: string | null }) {
  return (
    imgUrl && (
      <div className="mb-2 overflow-hidden rounded-md border bg-white">
        <img
          src={imgUrl}
          alt={`Vista previa de ${imgUrl}`}
          className="h-auto w-full object-contain max-h-[300px]"
        />
      </div>
    )
  );
}

function SetImageButtons({
  imgLabel,
  imgName,
  imgUrl,
  inputRef,
  removeHandler,
}: {
  imgLabel: string;
  imgName: keyof ImagesData;
  imgUrl: string | null;
  inputRef: RefObject<HTMLInputElement>;
  removeHandler: (
    imgName: keyof ImagesData,
    ref: RefObject<HTMLInputElement>,
  ) => void;
}) {
  return imgUrl ? (
    <div className="flex gap-2">
      <Button type="button" onClick={() => inputRef.current?.click()}>
        Cambiar {imgLabel}
      </Button>
      <Button
        type="button"
        variant="destructive"
        onClick={() => removeHandler(imgName, inputRef)}
      >
        Borrar
      </Button>
    </div>
  ) : (
    <Button type="button" onClick={() => inputRef.current?.click()}>
      Cargar {imgLabel}
    </Button>
  );
}
