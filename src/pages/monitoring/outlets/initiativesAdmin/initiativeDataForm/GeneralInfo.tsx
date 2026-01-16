import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import TextareaAutosize from "react-textarea-autosize";

import {
  ErrorsList,
  LabelAndErrors,
  LegendAndErrors,
} from "@ui/LabelingWithErrors";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupTextarea,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import { StrValidator } from "@utils/strValidator";
import {
  INITIAVIVE_NAME_MAX_LENGTH,
  INITIAVIVE_SHORTNAME_MAX_LENGTH,
  INITIAVIVE_DESCRIPTION_MAX_LENGTH,
  INITIAVIVE_OBJECTIVE_MAX_LENGTH,
  INITIAVIVE_INFLUENCE_MAX_LENGTH,
} from "@config/monitoring";

import type {
  GeneralInfo,
  InitiativeDataFormErr,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import {
  initiativeNameNotExist,
  validationExemption,
} from "pages/monitoring/outlets/initiativesAdmin/utils/fieldClientValidations";
import { PlainInputContainer } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/PlainInputContainer";

export function GeneralInfoInput<T extends GeneralInfo>({
  title,
  sectionInfo,
  sectionUpdater,
  validationErrorsObj = {},
  submitBlocker,
}: {
  title?: string;
  sectionInfo: GeneralInfo;
  sectionUpdater: (value: T) => void;
  validationErrorsObj: Partial<InitiativeDataFormErr["general"]>;
  submitBlocker?:
    | Dispatch<SetStateAction<boolean>>
    | ((value: boolean) => void);
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
      ) as T;

      sectionUpdater(infoClean);
    },
    [generalInfo, sectionUpdater],
  );

  const nameOnBlur = async () =>
    validateField(
      "name",
      await new StrValidator(generalInfo.name, submitBlocker)
        .sanitize()
        .isRequired()
        .hasLengthLessOrEqualThan(INITIAVIVE_NAME_MAX_LENGTH)
        .customAsync(
          validationExemption(
            initiativeNameNotExist,
            generalInfo.name === sectionInfo.name,
          ),
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
        .hasLengthLessOrEqualThan(INITIAVIVE_OBJECTIVE_MAX_LENGTH),
    );

  const influenceOnBlur = () =>
    validateField(
      "influenceArea",
      new StrValidator(generalInfo.influenceArea)
        .isOptional()
        .sanitize()
        .hasLengthLessOrEqualThan(INITIAVIVE_INFLUENCE_MAX_LENGTH),
    );

  return (
    <PlainInputContainer
      isFieldset={!!title}
      hasError={inputErr.root !== undefined && inputErr.root.length > 0}
    >
      {title ? (
        <LegendAndErrors validationErrors={inputErr?.root ?? []}>
          {title}
        </LegendAndErrors>
      ) : (
        <ErrorsList errorItems={inputErr?.root ?? []} />
      )}

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
          ¿Quienes somos? <span aria-hidden="true">*</span>{" "}
          <i>Descripción de la iniciativa</i>
        </LabelAndErrors>

        <InputGroup>
          <TextareaAutosize
            data-slot="input-group-control"
            className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
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

      <div className="flex flex-wrap [&>div]:flex-[1_0_250px] gap-2 items-start">
        <div>
          <LabelAndErrors
            errID="errors_influenceArea"
            htmlFor="influenceArea"
            validationErrors={inputErr.influenceArea ?? []}
          >
            ¿Dónde estamos? <i>Contexto territorial y área de influencia</i>
          </LabelAndErrors>

          <InputGroup>
            <TextareaAutosize
              data-slot="input-group-control"
              className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
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
              rows={10}
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

        <div>
          <LabelAndErrors
            errID="errors_objective"
            htmlFor="objective"
            validationErrors={inputErr.objective ?? []}
          >
            ¿Cuál es el objetivo? <i>Objetivos y enfoque de la iniciativa</i>
          </LabelAndErrors>

          <InputGroup>
            <TextareaAutosize
              data-slot="input-group-control"
              className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
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
              rows={10}
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
      </div>
    </PlainInputContainer>
  );
}
