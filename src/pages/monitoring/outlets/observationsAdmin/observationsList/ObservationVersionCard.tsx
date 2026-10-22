import {
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ObservationVersionTexts,
  ObservationVersionTextType,
  type ObservationData,
} from "pages/monitoring/types/observations";
import { ErrorsList, LabelAndErrors } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import { LOCALE } from "@config/global";
import {
  fromLexicalEditorStateRefToMarkdown,
  parseSimpleMarkdown,
} from "@utils/textParser";
import { EditorState } from "lexical";
import {
  availableTransformers,
  RichTextEditor,
} from "@composites/RichTextEditor";
import { StrValidator } from "@utils/strValidator";
import { updateObservationData } from "pages/monitoring/api/services/observations";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { observationVersionTexts } from "pages/monitoring/outlets/observationsAdmin/layout/observationVersionSetup.ts";
// import { uiText } from "../layout/uiText";
import { UserRoundCheck } from "lucide-react";
import { toast } from "sonner";
import { OBSERVATION_VERSION_DESCRIPTION_FIELD_MAX_LENGHT } from "@config/monitoring";

export function ObservationVersionCard({
  observationData,
  editingThis,
  onUpdateSuccess,
}: {
  observationData: ObservationData;
  editingThis: boolean;
  onUpdateSuccess: () => Promise<void>;
}) {
  const [resetKey, setResetKey] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ObservationVersionTexts | "root", string[]>>
  >({});

  const observationTextsRef = useRef<
    Map<keyof ObservationVersionTexts, MutableRefObject<EditorState | null>>
  >(new Map());

  observationVersionTexts.forEach((observationInfo) => {
    observationTextsRef.current.set(observationInfo.key, { current: null });
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const observationTexts = observationTextsRef.current;

    setErrors({});
    let hasErrors = false;

    const observationInfo: ObservationVersionTexts = [
      ...observationTexts.entries(),
    ].reduce<ObservationVersionTexts>(
      (all, [observationKey, observationTextLexical]) => {
        const original = observationData[observationKey];

        const observationText = fromLexicalEditorStateRefToMarkdown(
          observationTextLexical,
          availableTransformers,
        );

        if (observationText !== original) {
          const [validatedText, validationErrors] = new StrValidator(
            observationText,
          ).hasLengthLessOrEqualThan(
            OBSERVATION_VERSION_DESCRIPTION_FIELD_MAX_LENGHT,
          ).result;

          if (validationErrors.length > 0) {
            setErrors((oldErr) => ({
              ...oldErr,
              [observationKey]: validationErrors,
            }));

            hasErrors = true;
            return all;
          }

          all[observationKey] = validatedText;
        } else {
          all[observationKey] = original;
        }

        return all;
      },
      {},
    );

    if (hasErrors || Object.keys(observationInfo).length === 0) {
      return;
    }

    setIsloading(true);
    const res = await updateObservationData(
      observationData.id,
      observationInfo as Record<keyof ObservationVersionTexts, string>,
    );

    setIsloading(false);
    if (isMonitoringAPIError(res)) {
      setErrors((old) => ({ ...old, root: res.data.map((err) => err.msg) }));
      return;
    }

    await onUpdateSuccess();
    setResetKey((prev) => prev + 1);

    toast("Textos de version actualizados", {
      position: "bottom-right",
      description: `Los textos esta observación en la version ${observationData.version} de ${new Date(observationData.creationDate).toLocaleDateString(LOCALE)} han sido actualizados correctamente.`,
      icon: <UserRoundCheck className="size-8 text-primary" />,
      className: "px-6! gap-6! border-2! border-primary!",
    });
  };

  const handleReset = () => {
    setErrors({});
    setResetKey((prev) => prev + 1);
  };

  const observationVersionDate = new Date(observationData.creationDate);

  return (
    <div
      key={`${observationData.observationId}_${observationData.id}_${resetKey}`}
      className="border border-muted rounded-lg"
    >
      {!editingThis ? (
        <div className="p-4 space-y-4">
          <div className="text-lg text-primary font-normal">
            Version del{" "}
            <time dateTime={observationVersionDate.toISOString()}>
              {observationVersionDate.toLocaleDateString(LOCALE, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          {observationVersionTexts.map((observationInfo) => {
            const description = observationData[observationInfo.key];

            const IconComponent = observationInfo.icon;

            return (
              <div key={observationInfo.key}>
                <div className="flex items-center gap-1 text-primary">
                  <IconComponent />
                  <span className="font-normal">{observationInfo.label}</span>
                </div>
                <div className="markdown-renderer">
                  {parseSimpleMarkdown(
                    description !== undefined && description !== ""
                      ? description
                      : `No hay textos asociados con '${observationInfo.label}' en esta versión de la observación`,
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <form
          onSubmit={(e) => void handleSubmit(e)}
          onReset={handleReset}
          className="space-y-4 bg-muted p-4 rounded-lg"
        >
          <ErrorsList
            errorItems={errors.root ?? []}
            className="bg-accent/10 border border-accent rounded-lg mx-4 mt-4 p-4"
          />

          {observationVersionTexts.map((observationInfo) => (
            <SectionTextEditor
              key={`textEditor_${observationInfo.key}`}
              sectionData={observationInfo}
              textToLoad={observationData[observationInfo.key] || ""}
              observationTextRef={
                observationTextsRef.current.get(observationInfo.key)!
              }
              errors={errors[observationInfo.key] ?? []}
            />
          ))}

          <div className="flex flex-row-reverse justify-between">
            <Button disabled={isLoading}>Guardar</Button>
            <Button type="reset" variant="outline_destructive">
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function SectionTextEditor({
  sectionData,
  observationTextRef,
  textToLoad,
  errors,
}: {
  sectionData: ObservationVersionTextType;
  observationTextRef: MutableRefObject<EditorState | null>;
  textToLoad: string;
  errors: string[];
}) {
  return (
    <fieldset>
      <LabelAndErrors
        htmlFor={`richText_${sectionData.key}`}
        validationErrors={errors}
        errID={`errors_text_${sectionData.key}`}
      >
        {sectionData.label}
      </LabelAndErrors>
      <RichTextEditor
        id={`richText_${sectionData.key}`}
        textToLoad={textToLoad}
        textStateRef={observationTextRef}
        placeholder={"nnnnnn"}
        className="bg-background"
        editorNamespace={`richText_${sectionData.key}`}
        describedBy={
          errors.length > 0 ? `errors_text_${sectionData.key}` : undefined
        }
        counter={true}
        maxLength={(OBSERVATION_VERSION_DESCRIPTION_FIELD_MAX_LENGHT / 3) * 2}
      />
    </fieldset>
  );
}
