import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { LabelAndErrors, LegendAndErrors } from "@ui/LabelingWithErrors";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupTextarea,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import { StrValidator } from "@utils/validator";
import { cn } from "@ui/shadCN/lib/utils";

import type {
  GeneralInfo,
  InitiativeDataFormErr,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import {
  getInitiatives,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";

const INITIAVIVE_NAME_MAX_LENGTH = 100;
const INITIAVIVE_SHORTNAME_MAX_LENGTH = 15;
const INITIAVIVE_DESCRIPTION_MAX_LENGTH = 500;

export function InitiativeGeneralInfo({
  title,
  sectionInfo,
  sectionUpdater,
  validationErrorsObj,
}: {
  title: string;
  sectionInfo: GeneralInfo;
  sectionUpdater: (value: GeneralInfo) => void;
  validationErrorsObj: Partial<InitiativeDataFormErr["general"]>;
}) {
  const [name, setName] = useState(sectionInfo.name ?? "");
  const [shortName, setShortName] = useState(sectionInfo.shortName ?? "");
  const [description, setDescription] = useState(sectionInfo.description ?? "");
  const [inputErr, setInputErr] = useState<
    Partial<InitiativeDataFormErr["general"]>
  >({});

  useEffect(() => {
    sectionUpdater({ name, shortName, description });
  }, [name, shortName, description, sectionUpdater]);

  useEffect(() => {
    setName(sectionInfo.name);
    setShortName(sectionInfo.shortName ?? "");
    setDescription(sectionInfo.description);
  }, [sectionInfo.name, sectionInfo.shortName, sectionInfo.description]);

  useEffect(() => {
    if (Object.keys(validationErrorsObj).length === 0) {
      return;
    }

    setInputErr((oldErr) => ({ ...oldErr, ...validationErrorsObj }));
  }, [validationErrorsObj]);

  const validateField = useCallback(
    (
      fieldName: keyof InitiativeDataFormErr["general"],
      fieldSetter: Dispatch<SetStateAction<string>>,
      validation: StrValidator,
    ) => {
      const [cleanValue, errors] = validation.result;

      if (errors.length > 0) {
        setInputErr((oldErr) => ({ ...oldErr, [fieldName]: errors }));
        return;
      }

      setInputErr(({ [fieldName]: _, ...oldErr }) => oldErr);
      fieldSetter(cleanValue);
    },
    [],
  );

  const nameOnBlur = async () =>
    validateField(
      "name",
      setName,
      await new StrValidator(name)
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
      setShortName,
      new StrValidator(shortName)
        .isOptional()
        .sanitize()
        .hasLengthLessOrEqualThan(INITIAVIVE_SHORTNAME_MAX_LENGTH),
    );

  const descriptionOnBlur = () =>
    validateField(
      "description",
      setDescription,
      new StrValidator(description)
        .sanitize()
        .isRequired()
        .hasLengthLessOrEqualThan(INITIAVIVE_DESCRIPTION_MAX_LENGTH),
    );

  return (
    <fieldset
      className={cn(
        "p-4 rounded-lg flex flex-col gap-2",
        inputErr.root !== undefined && inputErr.root.length > 0
          ? "bg-red-50 outline-2 outline-accent"
          : "",
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              className={inputWarnColor(name, INITIAVIVE_NAME_MAX_LENGTH)}
            >
              {inputLengthCount(name, INITIAVIVE_NAME_MAX_LENGTH)}
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
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
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
                shortName,
                INITIAVIVE_SHORTNAME_MAX_LENGTH,
                0.8,
              )}
            >
              {inputLengthCount(
                shortName,
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
              description,
              INITIAVIVE_DESCRIPTION_MAX_LENGTH,
              0.95,
            )} flex-row-reverse`}
          >
            {`${description.length} / ${INITIAVIVE_DESCRIPTION_MAX_LENGTH}
		  `}
          </InputGroupAddon>
        </InputGroup>
      </div>
    </fieldset>
  );
}

async function initiativeNameNotExist(initiativeName: string) {
  const existingInitiative = await getInitiatives({
    filter: `name eq '${initiativeName}'`,
  });

  if (isMonitoringAPIError(existingInitiative)) {
    throw new Error(existingInitiative.message);
  }

  return existingInitiative["@odata.count"] === 0;
}
