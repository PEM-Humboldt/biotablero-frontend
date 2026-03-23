import { useRef } from "react";
import { useParams } from "react-router";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import { StrValidator } from "@utils/strValidator";
import { TERRITORY_STORY_TITLE_MAX_LENGTH } from "@config/monitoring";

import { validationExemption } from "pages/monitoring/ui/initiativesAdmin/utils/fieldClientValidations";
import { storyTitleNotExist } from "pages/monitoring/outlets/initiatives/territoryStories/utils/validations.ts";

export function TitleInput({
  title,
  titleUpdater,
  text,
  errors,
  setErrors,
}: {
  title: string;
  titleUpdater: (title: string) => void;
  text: { label: string; placeholder: string };
  errors: string[];
  setErrors: (title: string[]) => void;
}) {
  const { initiativeId } = useParams();
  const titleRef = useRef(title);

  const validateTitle = async () => {
    setErrors([]);

    const [cleanTitle, titleErrors] = (
      await new StrValidator(title)
        .sanitize()
        .isRequired()
        .hasLengthLessOrEqualThan(TERRITORY_STORY_TITLE_MAX_LENGTH)
        .customAsync(
          validationExemption(
            storyTitleNotExist(Number(initiativeId ?? 0)),
            title === titleRef.current,
          ),
          "Este título ya lo usa otro relato de la iniciativa",
        )
    ).result;

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
        required={true}
      >
        {text.label}
      </LabelAndErrors>

      <InputGroup>
        <InputGroupInput
          name="title"
          id="title"
          type="text"
          value={title}
          onChange={(e) => titleUpdater(e.target.value)}
          onBlur={() => void validateTitle()}
          autoComplete="off"
          placeholder={text.placeholder}
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
