import { type MutableRefObject } from "react";
import { $getRoot, type EditorState } from "lexical";

import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { StrValidator } from "@utils/strValidator";
import { RichTextEditor } from "@composites/RichTextEditor";
import {
  TERRITORY_STORY_TEXT_MAX_LENGTH,
  TERRITORY_STORY_TEXT_MIN_LENGTH,
} from "@config/monitoring";

export function TextEditor({
  textToLoad,
  textStateRef,
  editorNamespace,
  text,
  className,
  errors,
  setErrors,
}: {
  textToLoad?: string;
  textStateRef: MutableRefObject<EditorState | null>;
  editorNamespace?: string;
  text: { label: string; placeholder: string };
  className?: string;
  errors: string[];
  setErrors: (title: string[]) => void;
}) {
  const handleOnChange = () => {
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateText = () => {
    if (textStateRef.current === null) {
      return;
    }
    const editorState = textStateRef.current;
    if (!editorState) {
      return;
    }

    setErrors([]);
    const plaintText = editorState.read(() => $getRoot().getTextContent());
    const [_, textErrors] = new StrValidator(plaintText)
      .isRequired()
      .hasLengthMoreThan(TERRITORY_STORY_TEXT_MIN_LENGTH)
      .hasLengthLessOrEqualThan(TERRITORY_STORY_TEXT_MAX_LENGTH).result;

    setErrors(textErrors);
  };

  return (
    <div>
      <LabelAndErrors
        htmlFor="text"
        validationErrors={errors}
        errID="errors_text"
        required={true}
      >
        {text.label}
      </LabelAndErrors>
      <RichTextEditor
        id="text"
        textToLoad={textToLoad}
        textStateRef={textStateRef}
        placeholder={text.placeholder}
        className={className}
        editorNamespace={editorNamespace}
        describedBy={errors.length > 0 ? "errors_text" : undefined}
        onChange={handleOnChange}
        onBlur={validateText}
        counter={true}
        maxLength={TERRITORY_STORY_TEXT_MAX_LENGTH}
      />
    </div>
  );
}
