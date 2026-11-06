import { type FormEvent, type MutableRefObject, useRef, useState } from "react";
import type {
  TopicVersionTexts,
  TopicVersionTextType,
  TopicData,
} from "pages/monitoring/types/topics";
import { ErrorsList, LabelAndErrors } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";
import { LOCALE } from "@config/global";
import {
  fromLexicalEditorStateRefToMarkdown,
  parseSimpleMarkdown,
} from "@utils/textParser";
import { type EditorState } from "lexical";
import {
  availableTransformers,
  RichTextEditor,
} from "@composites/RichTextEditor";
import { StrValidator } from "@utils/strValidator";
import { updateTopicData } from "pages/monitoring/api/services/topics";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { topicVersionTexts } from "pages/monitoring/outlets/topicsAdmin/layout/topicVersionSetup";
import { uiText } from "pages/monitoring/outlets/topicsAdmin/layout/uiText";
import { UserRoundCheck } from "lucide-react";
import { toast } from "sonner";
import { TOPIC_VERSION_DESCRIPTION_FIELD_MAX_LENGHT } from "@config/monitoring";

export function TopicVersionCard({
  topicData,
  editingThis,
  onUpdateSuccess,
}: {
  topicData: TopicData;
  editingThis: boolean;
  onUpdateSuccess: () => Promise<void>;
}) {
  const [resetKey, setResetKey] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TopicVersionTexts | "root", string[]>>
  >({});

  const topicTextsRef = useRef<
    Map<keyof TopicVersionTexts, MutableRefObject<EditorState | null>>
  >(new Map());

  topicVersionTexts.forEach((topicInfo) => {
    topicTextsRef.current.set(topicInfo.key, { current: null });
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const topicTexts = topicTextsRef.current;

    setErrors({});
    let hasErrors = false;

    const topicInfo: TopicVersionTexts = [
      ...topicTexts.entries(),
    ].reduce<TopicVersionTexts>((all, [topicKey, topicTextLexical]) => {
      const original = topicData[topicKey];

      const topicText = fromLexicalEditorStateRefToMarkdown(
        topicTextLexical,
        availableTransformers,
      );

      if (topicText !== original) {
        const [validatedText, validationErrors] = new StrValidator(
          topicText,
        ).hasLengthLessOrEqualThan(
          TOPIC_VERSION_DESCRIPTION_FIELD_MAX_LENGHT,
        ).result;

        if (validationErrors.length > 0) {
          setErrors((oldErr) => ({
            ...oldErr,
            [topicKey]: validationErrors,
          }));

          hasErrors = true;
          return all;
        }

        all[topicKey] = validatedText;
      } else {
        all[topicKey] = original;
      }

      return all;
    }, {});

    if (hasErrors || Object.keys(topicInfo).length === 0) {
      return;
    }

    setIsloading(true);
    const res = await updateTopicData(
      topicData.id,
      topicInfo as Record<keyof TopicVersionTexts, string>,
    );

    setIsloading(false);
    if (isMonitoringAPIError(res)) {
      setErrors((old) => ({ ...old, root: res.data.map((err) => err.msg) }));
      return;
    }

    await onUpdateSuccess();
    setResetKey((prev) => prev + 1);

    toast(uiText.topicVersionCard.updatedToast.title, {
      position: "bottom-right",
      description: uiText.topicVersionCard.updatedToast.description(
        topicData.version,
        new Date(topicData.creationDate),
      ),
      icon: <UserRoundCheck className="size-8 text-primary" />,
      className: "px-6! gap-6! border-2! border-primary!",
    });
  };

  const handleReset = () => {
    setErrors({});
    setResetKey((prev) => prev + 1);
  };

  const topicVersionDate = new Date(topicData.creationDate);

  return (
    <div
      key={`${topicData.topicId}_${topicData.id}_${resetKey}`}
      className="border border-muted rounded-lg"
    >
      {!editingThis ? (
        <div className="p-4 space-y-4">
          <div className="text-lg text-primary font-normal">
            {uiText.topicVersionCard.editVersionTitlePrefix}
            <time dateTime={topicVersionDate.toISOString()}>
              {topicVersionDate.toLocaleDateString(LOCALE, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          {topicVersionTexts.map((topicInfo) => {
            const description = topicData[topicInfo.key];

            const IconComponent = topicInfo.icon;

            return (
              <div key={topicInfo.key}>
                <div className="flex items-center gap-1 text-primary">
                  <IconComponent />
                  <span className="font-normal">{topicInfo.label}</span>
                </div>
                <div className="markdown-renderer">
                  {description !== undefined && description !== ""
                    ? parseSimpleMarkdown(description)
                    : uiText.topicVersionCard.noTextInThisVersion(
                        topicInfo.label,
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

          {topicVersionTexts.map((topicInfo) => (
            <SectionTextEditor
              key={`textEditor_${topicInfo.key}`}
              sectionData={topicInfo}
              textToLoad={topicData[topicInfo.key] || ""}
              topicTextRef={topicTextsRef.current.get(topicInfo.key)!}
              errors={errors[topicInfo.key] ?? []}
            />
          ))}

          <div className="flex flex-row-reverse justify-between">
            <Button
              disabled={isLoading}
              title={uiText.topicVersionCard.saveBtn.title}
              aria-label={uiText.topicVersionCard.saveBtn.sr}
            >
              {uiText.topicVersionCard.saveBtn.label}
            </Button>
            <Button
              type="reset"
              variant="outline_destructive"
              title={uiText.topicVersionCard.cancelBtn.title}
              aria-label={uiText.topicVersionCard.cancelBtn.sr}
            >
              {uiText.topicVersionCard.cancelBtn.label}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function SectionTextEditor({
  sectionData,
  topicTextRef,
  textToLoad,
  errors,
}: {
  sectionData: TopicVersionTextType;
  topicTextRef: MutableRefObject<EditorState | null>;
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
        textStateRef={topicTextRef}
        placeholder={uiText.topicVersionCard.textEditorPlaceHolder}
        className="bg-background"
        editorNamespace={`richText_${sectionData.key}`}
        describedBy={
          errors.length > 0 ? `errors_text_${sectionData.key}` : undefined
        }
        counter={true}
        maxLength={(TOPIC_VERSION_DESCRIPTION_FIELD_MAX_LENGHT / 3) * 2}
      />
    </fieldset>
  );
}
