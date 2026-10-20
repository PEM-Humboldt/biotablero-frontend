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
import { motion } from "motion/react";
import {
  fromLexicalEditorStateRefToMarkdown,
  parseSimpleMarkdown,
} from "@utils/textParser";
import { $getRoot, EditorState } from "lexical";
import {
  availableTransformers,
  RichTextEditor,
} from "@composites/RichTextEditor";
import { StrValidator } from "@utils/strValidator";
import { updateObservationData } from "pages/monitoring/api/services/observations";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { observationVersionTexts } from "pages/monitoring/outlets/observationsAdmin/layout/observationVersionSetup.ts";
import { uiText } from "../layout/uiText";

export function ObservationVersionCard({
  observationData,
  editingThis,
  onUpdateSuccess,
}: {
  observationData: ObservationData;
  editingThis: boolean;
  onUpdateSuccess: () => Promise<void>;
}) {
  const [isLoading, setIsloading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const observationTextsRef = useRef<
    Map<keyof ObservationVersionTexts, MutableRefObject<EditorState | null>>
  >(new Map());

  const observationVersionDate = new Date(observationData.creationDate);

  useEffect(() => {
    return () => {
      observationTextsRef.current = new Map();
    };
  }, []);

  observationVersionTexts.forEach((observationInfo) => {
    if (!observationTextsRef.current.has(observationInfo.key)) {
      observationTextsRef.current.set(observationInfo.key, { current: null });
    }
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const observationInfo: ObservationVersionTexts = {};
    const observationTexts = observationTextsRef.current;

    [...observationTexts.entries()].forEach(
      ([observationKey, observationTextLexical]) => {
        const observationText = fromLexicalEditorStateRefToMarkdown(
          observationTextLexical,
          availableTransformers,
        );

        if (observationText) {
          observationInfo[observationKey] = observationText;
        }
      },
    );

    if (Object.keys(observationInfo).length === 0) {
      return;
    }

    setIsloading(true);
    const res = await updateObservationData(
      observationData.id,
      observationInfo as Record<keyof ObservationVersionTexts, string>,
    );

    setIsloading(false);
    if (isMonitoringAPIError(res)) {
      setErrors(res.data.map((err) => err.msg));
      return;
    }

    onUpdateSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
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
          className="space-y-4 bg-muted p-4 rounded-lg"
        >
          <ErrorsList
            errorItems={errors}
            className="bg-accent/10 border border-accent rounded-lg mx-4 mt-4 p-4"
          />

          {observationVersionTexts.map((observationInfo) => (
            <SectionTextEditor
              key={`textEditor_${observationInfo.key}`}
              sectionData={observationInfo}
              textToLoad={observationData[observationInfo.key] ?? ""}
              observationTextRef={
                observationTextsRef.current.get(observationInfo.key)!
              }
            />
          ))}

          <div className="flex flex-row-reverse justify-between">
            <Button disabled={isLoading}>Guardar</Button>
            <Button
              type="button"
              variant="outline_destructive"
              onClick={() => console.log("nara 222")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </motion.div>
  );
}

function SectionTextEditor({
  sectionData,
  observationTextRef,
  textToLoad,
}: {
  sectionData: ObservationVersionTextType;
  observationTextRef: MutableRefObject<EditorState | null>;
  textToLoad: string;
}) {
  const [errors, setErrors] = useState<string[]>([]);

  const handleValidation = () => {
    const editorState = observationTextRef.current;
    if (!editorState) {
      return;
    }

    setErrors([]);
    const plaintext = editorState.read(() => $getRoot().getTextContent());
    const [_, textValidationErrors] = new StrValidator(
      plaintext,
    ).hasLengthLessOrEqualThan(120).result;

    setErrors(textValidationErrors);
  };

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
        onChange={handleValidation}
        onBlur={handleValidation}
        counter={true}
        maxLength={300}
      />
    </fieldset>
  );
}
