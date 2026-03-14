import { TERRITORY_STORY_TITLE_MAX_LENGTH } from "@config/monitoring";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { useState } from "react";
import { StrValidator } from "@utils/strValidator";

export function TitleInput({
  title,
  titleUpdater,
}: {
  title: string;
  titleUpdater: (title: string) => void;
}) {
  const [errors, setErrors] = useState<string[]>([]);

  const validateTitle = () => {
    setErrors([]);
    const [cleanTitle, titleErrors] = new StrValidator(title)
      .isRequired()
      .hasLengthMoreThan(4)
      .hasLengthLessOrEqualThan(TERRITORY_STORY_TITLE_MAX_LENGTH).result;

    if (titleErrors.length > 0) {
      setErrors(titleErrors);
      return;
    }

    titleUpdater(cleanTitle);
  };

  return (
    <div>
      <LabelAndErrors
        errID="errors_title"
        validationErrors={errors}
        htmlFor="title"
        className="text-primary font-normal"
      >
        Título
        <span aria-hidden="true"> *</span>
      </LabelAndErrors>

      <InputGroup>
        <InputGroupInput
          name="title"
          id="title"
          type="text"
          value={title}
          onChange={(e) => titleUpdater(e.target.value)}
          onBlur={validateTitle}
          autoComplete="off"
          placeholder="Este es el título de mi relato"
          aria-invalid={errors.length > 0}
          aria-describedby={errors.length > 0 ? "errors_title" : undefined}
          maxLength={TERRITORY_STORY_TITLE_MAX_LENGTH}
          aria-required="true"
        />
        <InputGroupAddon
          align="inline-end"
          className={inputWarnColor(title, TERRITORY_STORY_TITLE_MAX_LENGTH)}
        >
          {inputLengthCount(title, TERRITORY_STORY_TITLE_MAX_LENGTH)}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
