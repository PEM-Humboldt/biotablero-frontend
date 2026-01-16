import {
  type ChangeEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { ImageUp, Trash, UndoDot } from "lucide-react";

import { cn } from "@ui/shadCN/lib/utils";
import {
  ErrorsList,
  LabelAndErrors,
  LegendAndErrors,
} from "@ui/LabelingWithErrors";
import type { ImageMimeType } from "@appTypes/formats";
import { ImgValidator } from "@utils/imgValidator";
import { Button } from "@ui/shadCN/component/button";
import { INITIATIVES_IMG_ALLOWED_FORMATS } from "@config/monitoring";

import type {
  ErrorFields,
  ImagesData,
  InitiativeDataFormErr,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { PlainInputContainer } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/PlainInputContainer";

const setInitialImageInfo = (e: unknown) => (e instanceof File ? e : null);
const setInitialImagePrv = (e: unknown) => (typeof e === "string" ? e : null);

export function ImagesInput({
  title,
  sectionInfo,
  sectionUpdater,
  validationErrorsObj = {},
}: {
  title?: string;
  sectionInfo: ImagesData;
  sectionUpdater: (value: ImagesData) => void;
  validationErrorsObj: Partial<InitiativeDataFormErr["images"]>;
}) {
  const [imagesInfo, setImagesInfo] = useState<ImagesData>({
    imageUrl: setInitialImageInfo(sectionInfo.imageUrl),
    bannerUrl: setInitialImageInfo(sectionInfo.bannerUrl),
  });
  const [imagesPreview, setImagesPreview] = useState<{
    [K in keyof ImagesData]?: string | null;
  }>({
    imageUrl: setInitialImagePrv(sectionInfo.imageUrl),
    bannerUrl: setInitialImagePrv(sectionInfo.bannerUrl),
  });
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

  useEffect(() => {
    setInputErr((oldErr) => ({ ...oldErr, ...validationErrorsObj }));
  }, [validationErrorsObj]);

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
    <PlainInputContainer
      isFieldset={!!title}
      hasError={inputErr.root !== undefined && inputErr.root.length > 0}
    >
      {title ? (
        <LegendAndErrors validationErrors={inputErr?.root ?? []}>
          {title}
        </LegendAndErrors>
      ) : (
        <ErrorsList errorItems={inputErr?.root ?? []} />
      )}

      <div className="flex gap-8 flex-wrap items-end *:flex-[1_1_350px]">
        <ImageLoadField
          title="Imagen de la iniciativa"
          fieldName="imageUrl"
          errorObject={inputErr}
          previewObject={imagesPreview}
          inputRef={imageUrlRef}
          validFormats={INITIATIVES_IMG_ALLOWED_FORMATS}
          onChangeCallback={onChangeImageUrl}
          removeHandler={handleRemoveImage}
        />

        <ImageLoadField
          title="Banner"
          fieldName="bannerUrl"
          errorObject={inputErr}
          previewObject={imagesPreview}
          inputRef={bannerUrlRef}
          validFormats={INITIATIVES_IMG_ALLOWED_FORMATS}
          onChangeCallback={onChangeBannerUrl}
          removeHandler={handleRemoveImage}
        />
      </div>

      {Object.keys(inputErr).length > 0 && (
        <Button type="button">Cargar de nuevo</Button>
      )}
    </PlainInputContainer>
  );
}

function ImageLoadField({
  title,
  fieldName,
  errorObject,
  previewObject,
  inputRef,
  validFormats,
  onChangeCallback,
  removeHandler,
}: {
  title: string;
  fieldName: keyof ImagesData;
  errorObject: ErrorFields<ImagesData>;
  previewObject: { [K in keyof ImagesData]?: string | null };
  inputRef: RefObject<HTMLInputElement>;
  validFormats: ImageMimeType[];
  onChangeCallback: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeHandler: (
    imgName: keyof ImagesData,
    ref: RefObject<HTMLInputElement>,
  ) => void;
}) {
  const imgUrl = previewObject[fieldName];

  return (
    <div>
      <LabelAndErrors
        htmlFor={fieldName}
        errID={`errors_${fieldName}`}
        validationErrors={errorObject[fieldName] ?? []}
      >
        {title}
      </LabelAndErrors>

      <div
        className={cn(
          "relative group mt-1 overflow-hidden rounded-xl border border-primary border-dashed bg-white h-[200px] transition-all focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
          errorObject[fieldName] !== undefined
            ? "bg-red-50 focus-within:outline-accent border-accent"
            : "",
        )}
      >
        <button
          type="button"
          className="absolute inset-0 w-full h-full cursor-pointer z-0 opacity-0"
          onClick={() => inputRef.current?.click()}
          aria-label={`Cargar imagen para ${title}`}
        />

        <div className="absolute inset-0 p-2 flex items-center justify-center pointer-events-none z-0">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={`Vista previa de ${title}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageUp className="w-16 h-16 opacity-30 text-primary" />
              <span className="text-base text-primary">
                Clic para cargar una imagen
              </span>
            </div>
          )}
        </div>

        <div className="absolute bottom-3 right-3 flex gap-2 z-10">
          {(imgUrl || errorObject[fieldName]) && (
            <Button
              type="button"
              variant="outline_destructive"
              className="bg-white shadow-md h-9 w-9"
              onClick={(e) => {
                e.stopPropagation();
                removeHandler(fieldName, inputRef);
              }}
            >
              <span className="sr-only">Borrar imagen</span>
              {errorObject[fieldName] ? (
                <UndoDot aria-hidden="true" />
              ) : (
                <Trash aria-hidden="true" />
              )}
            </Button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        name={fieldName}
        id={fieldName}
        type="file"
        className="sr-only"
        accept={validFormats.join(", ")}
        onChange={(e) => void onChangeCallback(e)}
        aria-invalid={errorObject[fieldName] !== undefined}
        aria-describedby={
          errorObject[fieldName] ? `errors_${fieldName}` : undefined
        }
      />
    </div>
  );
}
