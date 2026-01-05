import { useCallback, useEffect, useState } from "react";

import { LabelAndErrors, LegendAndErrors } from "@ui/LabelingWithErrors";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupTextarea,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import { StrValidator } from "@utils/strValidator";
import { cn } from "@ui/shadCN/lib/utils";

import type {
  GeneralInfo,
  InitiativeDataFormErr,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { initiativeNameNotExist } from "pages/monitoring/outlets/initiativesAdmin/utils/fieldClientValidations";

const INITIAVIVE_NAME_MAX_LENGTH = 100;
const INITIAVIVE_SHORTNAME_MAX_LENGTH = 15;
const INITIAVIVE_DESCRIPTION_MAX_LENGTH = 500;
const INITIAVIVE_OBJECTIVE_MAX_LENGTH = 300;
const INITIAVIVE_INFLUENCE_MAX_LENGTH = 250;

export function InitiativeGeneralInfo({
  title,
  sectionInfo,
  sectionUpdater,
  validationErrorsObj = {},
}: {
  title: string;
  sectionInfo: GeneralInfo;
  sectionUpdater: (value: GeneralInfo) => void;
  validationErrorsObj: Partial<InitiativeDataFormErr["general"]>;
}) {
  const [generalInfo, setGeneralInfo] = useState<Required<GeneralInfo>>({
    name: sectionInfo.name ?? "",
    shortName: sectionInfo.shortName ?? "",
    description: sectionInfo.description ?? "",
    objective: sectionInfo.objective ?? "",
    influenceArea: sectionInfo.influenceArea ?? "",
  });

  const [inputErr, setInputErr] = useState<
    Partial<InitiativeDataFormErr["general"]>
  >({});

  useEffect(() => {
    if (Object.keys(validationErrorsObj).length === 0) {
      return;
    }

    setInputErr((oldErr) => ({ ...oldErr, ...validationErrorsObj }));
  }, [validationErrorsObj]);

  const setGeneralInfoItem = (key: keyof GeneralInfo) => (value: string) => {
    setGeneralInfo((oldObj) => ({ ...oldObj, [key]: value }));
  };

  const validateField = useCallback(
    (fieldName: keyof GeneralInfo, validation: StrValidator) => {
      const [cleanValue, errors] = validation.result;

      if (errors.length > 0) {
        setInputErr((oldErr) => ({ ...oldErr, [fieldName]: errors }));
        return;
      }

      setInputErr(({ [fieldName]: _, ...oldErr }) => oldErr);
      setGeneralInfoItem(fieldName)(cleanValue);

      const infoClean = Object.fromEntries(
        Object.entries(generalInfo).filter(([_, value]) => Boolean(value)),
      ) as GeneralInfo;

      sectionUpdater(infoClean);
    },
    [generalInfo, sectionUpdater],
  );

  const nameOnBlur = async () =>
    validateField(
      "name",
      await new StrValidator(generalInfo.name)
        .sanitize()
        .isRequired()
        .hasLengthLessOrEqualThan(INITIAVIVE_NAME_MAX_LENGTH)
        .customAsync(
          initiativeNameNotExist,
          "Este nombre de iniciativa ya existe",
        ),
    );

  const shortNameOnBlur = () =>
    validateField(
      "shortName",
      new StrValidator(generalInfo.shortName)
        .isOptional()
        .sanitize()
        .hasLengthLessOrEqualThan(INITIAVIVE_SHORTNAME_MAX_LENGTH),
    );

  const descriptionOnBlur = () =>
    validateField(
      "description",
      new StrValidator(generalInfo.description)
        .sanitize()
        .isRequired()
        .hasLengthLessOrEqualThan(INITIAVIVE_DESCRIPTION_MAX_LENGTH),
    );

  const objectiveOnBlur = () =>
    validateField(
      "objective",
      new StrValidator(generalInfo.objective)
        .isOptional()
        .sanitize()
        .hasLengthLessOrEqualThan(INITIAVIVE_DESCRIPTION_MAX_LENGTH),
    );

  const influenceOnBlur = () =>
    validateField(
      "influenceArea",
      new StrValidator(generalInfo.influenceArea)
        .isOptional()
        .sanitize()
        .hasLengthLessOrEqualThan(INITIAVIVE_DESCRIPTION_MAX_LENGTH),
    );

  return (
    <fieldset
      className={cn(
        "rounded-lg flex flex-col gap-2 p-4 ",
        inputErr.root !== undefined && inputErr.root.length > 0
          ? "bg-red-50 outline-2 outline-accent"
          : "bg-muted",
      )}
    >
      <LegendAndErrors validationErrors={inputErr?.root ?? []}>
        {title}
      </LegendAndErrors>

      <div className="flex flex-wrap [&>div]:flex-[1_0_250px] gap-2 items-end">
        <div>
          <LabelAndErrors
            htmlFor="name"
            errID="errors_name"
            validationErrors={inputErr.name ?? []}
          >
            Nombre completo <span aria-hidden="true">*</span>
          </LabelAndErrors>

          <InputGroup>
            <InputGroupInput
              name="name"
              id="name"
              type="text"
              value={generalInfo.name}
              onChange={(e) => setGeneralInfoItem("name")(e.target.value)}
              onBlur={() => void nameOnBlur()}
              autoComplete="off"
              placeholder="Juntos por la Amazonía"
              maxLength={INITIAVIVE_NAME_MAX_LENGTH}
              aria-required="true"
              aria-invalid={inputErr.name !== undefined}
              aria-describedby={inputErr.name ? "errors_name" : undefined}
            />
            <InputGroupAddon
              align="inline-end"
              className={inputWarnColor(
                generalInfo.name,
                INITIAVIVE_NAME_MAX_LENGTH,
              )}
            >
              {inputLengthCount(generalInfo.name, INITIAVIVE_NAME_MAX_LENGTH)}
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div>
          <LabelAndErrors
            errID="errors_shortName"
            htmlFor="shortName"
            validationErrors={inputErr.shortName ?? []}
          >
            Nombre corto
          </LabelAndErrors>

          <InputGroup>
            <InputGroupInput
              name="shortName"
              id="shortName"
              placeholder="JPLA"
              type="text"
              value={generalInfo.shortName}
              onChange={(e) => setGeneralInfoItem("shortName")(e.target.value)}
              onBlur={shortNameOnBlur}
              autoComplete="off"
              maxLength={INITIAVIVE_SHORTNAME_MAX_LENGTH}
              aria-invalid={inputErr.shortName !== undefined}
              aria-describedby={
                inputErr.shortName ? "errors_shortName" : undefined
              }
            />
            <InputGroupAddon
              align="inline-end"
              className={inputWarnColor(
                generalInfo.shortName,
                INITIAVIVE_SHORTNAME_MAX_LENGTH,
                0.8,
              )}
            >
              {inputLengthCount(
                generalInfo.shortName,
                INITIAVIVE_SHORTNAME_MAX_LENGTH,
                0.6,
              )}
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      <div>
        <LabelAndErrors
          errID="errors_description"
          htmlFor="description"
          validationErrors={inputErr.description ?? []}
        >
          Descripción <span aria-hidden="true">*</span>
        </LabelAndErrors>

        <InputGroup>
          <InputGroupTextarea
            id="description"
            name="description"
            placeholder="Esta iniciativa busca..."
            value={generalInfo.description}
            onChange={(e) => setGeneralInfoItem("description")(e.target.value)}
            onBlur={descriptionOnBlur}
            maxLength={INITIAVIVE_DESCRIPTION_MAX_LENGTH}
            aria-invalid={inputErr.description !== undefined}
            aria-required="true"
            aria-describedby={
              inputErr.description ? "errors_description" : undefined
            }
          />
          <InputGroupAddon
            align="block-end"
            className={`${inputWarnColor(
              generalInfo.description,
              INITIAVIVE_DESCRIPTION_MAX_LENGTH,
              0.95,
            )} flex-row-reverse`}
          >
            {`${generalInfo.description.length} / ${INITIAVIVE_DESCRIPTION_MAX_LENGTH}
		  `}
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex flex-wrap [&>div]:flex-[1_0_250px] gap-2 items-end">
        <div>
          <LabelAndErrors
            errID="errors_objective"
            htmlFor="objective"
            validationErrors={inputErr.objective ?? []}
          >
            Objetivo
          </LabelAndErrors>

          <InputGroup>
            <InputGroupTextarea
              id="objective"
              name="objective"
              placeholder="El objetivo de esta iniciativa es..."
              value={generalInfo.objective}
              onChange={(e) => setGeneralInfoItem("objective")(e.target.value)}
              onBlur={objectiveOnBlur}
              maxLength={INITIAVIVE_OBJECTIVE_MAX_LENGTH}
              aria-invalid={inputErr.objective !== undefined}
              aria-required="true"
              aria-describedby={
                inputErr.objective ? "errors_objective" : undefined
              }
            />
            <InputGroupAddon
              align="block-end"
              className={`${inputWarnColor(
                generalInfo.objective,
                INITIAVIVE_OBJECTIVE_MAX_LENGTH,
                0.95,
              )} flex-row-reverse`}
            >
              {`${generalInfo.objective.length} / ${INITIAVIVE_OBJECTIVE_MAX_LENGTH}
		  `}
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div>
          <LabelAndErrors
            errID="errors_influenceArea"
            htmlFor="influenceArea"
            validationErrors={inputErr.influenceArea ?? []}
          >
            Área de influencia
          </LabelAndErrors>

          <InputGroup>
            <InputGroupTextarea
              id="influenceArea"
              name="influenceArea"
              placeholder="El área de influencia de esta iniciativa es..."
              value={generalInfo.influenceArea}
              onChange={(e) =>
                setGeneralInfoItem("influenceArea")(e.target.value)
              }
              onBlur={influenceOnBlur}
              maxLength={INITIAVIVE_INFLUENCE_MAX_LENGTH}
              aria-invalid={inputErr.influenceArea !== undefined}
              aria-required="true"
              aria-describedby={
                inputErr.influenceArea ? "errors_influenceArea" : undefined
              }
            />
            <InputGroupAddon
              align="block-end"
              className={`${inputWarnColor(
                generalInfo.influenceArea,
                INITIAVIVE_INFLUENCE_MAX_LENGTH,
                0.95,
              )} flex-row-reverse`}
            >
              {`${generalInfo.influenceArea.length} / ${INITIAVIVE_INFLUENCE_MAX_LENGTH}
		  `}
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </fieldset>
  );
}
