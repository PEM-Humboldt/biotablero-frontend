import { LabelAndErrors } from "@ui/LabelingWithErrors";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import type { Dispatch, InputHTMLAttributes, SetStateAction } from "react";

type AllowedInput =
  | "text"
  | "password"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "search";

interface LabeledInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  inputName: string;
  inputType?: AllowedInput;
  inputMaxLength?: number;
  required?: boolean;
  texts: { label?: string; sr?: string; placeholder?: string };
  state: string;
  stateSetter: (value: string) => void;
  validator?: () => Promise<void> | void;
  validationErrors: string[];
}

/**
 * A controlled input component with built-in labeling and validation states
 *
 * @param inputName - Unique string used for `id` and `name` attributes.
 * @param inputType - The HTML input type. Defaults to 'text'.
 * @param inputMaxLength - Optional maximum character limit. Enables a visual counter when provided.
 * @param required - Indicates if the field is mandatory.
 * @param texts - Object containing text strings for the UI:
 * - `label`: The visible text label.
 * - `sr`: text for screen readers only.
 * - `placeholder`: The input placeholder text.
 * @param state - The current value of the input.
 * @param stateSetter - State dispatch function to update the input value.
 * @param validator - Optional async input validation function triggered on `onBlur`.
 * @param validationErrors - An array of strings containing error messages.
 * @param rest - Supports all standard HTML input attributes
 */
export function LabeledInput({
  inputName,
  inputType = "text",
  inputMaxLength,
  required = false,
  texts,
  state,
  stateSetter,
  validator,
  validationErrors,
  ...rest
}: LabeledInputProps) {
  const hasErrors = validationErrors.length > 0;
  const errId = `errors_${inputName}`;
  return (
    <div className="w-full">
      <LabelAndErrors
        htmlFor={inputName}
        errID={errId}
        validationErrors={validationErrors}
      >
        {texts.label}
        {texts.sr && <span className="sr-only"> {texts.sr}</span>}
        {required && <span aria-hidden="true"> *</span>}
      </LabelAndErrors>

      <InputGroup>
        <InputGroupInput
          {...rest}
          name={inputName}
          id={inputName}
          type={inputType}
          value={state}
          onChange={(e) => stateSetter(e.target.value)}
          onBlur={() => void validator?.()}
          placeholder={texts.placeholder}
          maxLength={inputMaxLength}
          aria-required={required}
          aria-invalid={hasErrors}
          aria-describedby={validationErrors.length > 0 ? errId : undefined}
        />
        {inputMaxLength && (
          <InputGroupAddon
            align="inline-end"
            className={inputWarnColor(state, inputMaxLength)}
          >
            {inputLengthCount(state, inputMaxLength)}
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}
