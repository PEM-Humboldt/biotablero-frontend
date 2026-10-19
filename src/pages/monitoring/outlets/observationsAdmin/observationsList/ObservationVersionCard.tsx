import {
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type ObservationData,
  type ObservationMetadata,
} from "pages/monitoring/types/observations";
import { ErrorsList, LabelAndErrors } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import { LOCALE } from "@config/global";
import {
  BadgeCheck,
  BookOpenCheck,
  FilePenLine,
  LucideIcon,
  MessageCircleWarning,
  Network,
} from "lucide-react";
import { motion } from "motion/react";
import {
  fromLexicalEditorStateRefToMarkdown,
  parseSimpleMarkdown,
} from "@utils/textParser";
import { TextEditor } from "../../initiatives/territoryStories/ui/createEditTSForm/TextEditor";
import { EditorState } from "lexical";
import {
  availableTransformers,
  RichTextEditor,
} from "@composites/RichTextEditor";

type ObservationVersionTexts = Omit<
  ObservationData,
  "id" | "observationId" | "creationDate" | "version" | "groups"
>;

type ObservationVersionTextType = {
  key: keyof ObservationVersionTexts;
  label: string;
  icon: LucideIcon;
};

const observationVersionTexts: ObservationVersionTextType[] = [
  {
    key: "description",
    label: "¿Qué dice este indicador?",
    icon: BadgeCheck,
  },
  {
    key: "methodology",
    label: "Metodología",
    icon: Network,
  },
  {
    key: "interpretation",
    label: "Interpretación",
    icon: BookOpenCheck,
  },
  {
    key: "considerations",
    label: "Consideración",
    icon: MessageCircleWarning,
  },
  { key: "authorship", label: "Autoría", icon: FilePenLine },
];

export function ObservationVersionCard({
  observationMetadata,
  observationData,
}: {
  observationMetadata: ObservationMetadata;
  observationData: ObservationData;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const observationTextsRef = useRef<
    Map<keyof ObservationVersionTexts, MutableRefObject<EditorState | null>>
  >(new Map());

  observationVersionTexts.forEach((observationInfo) => {
    if (!observationTextsRef.current.has(observationInfo.key)) {
      observationTextsRef.current.set(observationInfo.key, { current: null });
    }
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const observationTexts = observationTextsRef.current;
    console.log("666", observationTexts);

    observationTexts.forEach((observationText) => {
      if (observationText) {
        console.log(
          fromLexicalEditorStateRefToMarkdown(
            observationText,
            availableTransformers,
          ),
        );
      }
    });
  };

  const observationVersionDate = new Date(observationData.creationDate);
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="border border-muted rounded-lg"
    >
      <ErrorsList
        errorItems={errors}
        className="bg-accent/10 border border-accent rounded-lg mx-4 mt-4 p-4"
      />

      {!isEditing ? (
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-primary font-normal">
              Version del{" "}
              <time dateTime={observationVersionDate.toISOString()}>
                {observationVersionDate.toLocaleDateString(LOCALE, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </span>
            <Button
              onClick={() => setIsEditing((isEditing) => !isEditing)}
              title={`Editar la version ${observationData.version} de ${new Date(observationData.creationDate).toLocaleDateString(LOCALE)}`}
            >
              <FilePenLine />
              Editar textos de la version
            </Button>
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
          onSubmit={handleSubmit}
          className="space-y-4 bg-muted p-4 rounded-lg"
        >
          {observationVersionTexts.map((observationInfo) => (
            <SectionTextEditor
              key={`textEditor_${observationInfo.key}`}
              sectionData={observationInfo}
              textToLoad=""
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
              onClick={() => setIsEditing(!isEditing)}
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
        // onChange={handleOnChange}
        // onBlur={validateText}
        counter={true}
        maxLength={3000}
      />
    </fieldset>
  );
}
