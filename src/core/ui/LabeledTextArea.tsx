import TextareaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { InputGroup, InputGroupAddon } from "@ui/shadCN/component/input-group";
import { inputWarnColor } from "@utils/ui";
import { cn } from "@ui/shadCN/lib/utils";

interface LabeledTextAreaProps extends TextareaAutosizeProps {
  inputName: string;
  inputMaxLength?: number;
  required?: boolean;
  texts: { label?: string; sr?: string; helper?: string; placeholder?: string };
  state: string;
  stateSetter: (value: string) => void;
  validator?: () => Promise<void | boolean> | void | boolean;
  validationErrors: string[];
}

/**
 * An auto-expanding textarea with integrated labeling, validation, and character counting.
 *
 * @param inputName - Unique string used for `id` and `name` attributes.
 * @param inputMaxLength - Optional maximum character limit.
 * @param required - Potional marks component as required.
 * @param texts - Content strings for the UI:
 * - `label`: The primary visible label.
 * - `sr`: Screen-reader only text.
 * - `helper`: Italicized hint text displayed within the label area.
 * - `placeholder`: Hint text displayed when the textarea is empty.
 * @param state - The current string value (controlled state).
 * @param stateSetter - Dispatch function to update the text state on change.
 * @param validator - Optional async input validation function triggered on `onBlur`.
 * @param validationErrors - Array of error strings.
 * @param rest - Supports all properties from `react-textarea-autosize` and standard textarea attributes.
 */
export function LabeledTextArea({
  inputName,
  inputMaxLength,
  required = false,
  texts,
  state,
  stateSetter,
  validator,
  validationErrors,
  ...rest
}: LabeledTextAreaProps) {
  const hasErrors = validationErrors.length > 0;
  const errId = `errors_${inputName}`;
  return (
    <div>
      <LabelAndErrors
        errID={errId}
        htmlFor={inputName}
        validationErrors={validationErrors}
      >
        {texts.label}
        {texts.sr && <span className="sr-only">{texts.sr}</span>}
        {required && <span aria-hidden="true"> *</span>}
        {texts.helper && <i>{texts.helper}</i>}
      </LabelAndErrors>

      <InputGroup>
        <TextareaAutosize
          {...rest}
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          id="description"
          name="description"
          placeholder={texts.placeholder}
          value={state}
          onChange={(e) => stateSetter(e.target.value)}
          onBlur={() => void validator?.()}
          maxLength={inputMaxLength}
          aria-invalid={hasErrors}
          aria-required={required}
          aria-describedby={hasErrors ? errId : undefined}
        />
        {inputMaxLength && (
          <InputGroupAddon
            align="block-end"
            className={cn(
              inputWarnColor(state, inputMaxLength, 0.95),
              "flex-row-reverse",
            )}
          >
            {state.length} / {inputMaxLength}
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}
