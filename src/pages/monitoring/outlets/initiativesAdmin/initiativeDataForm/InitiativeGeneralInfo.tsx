import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { TextAndErrorForLabel } from "@ui/TextAndErrorForLabel";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupTextarea,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import { StrValidator } from "@utils/validator";

import type { GeneralInfo } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

const INITIAVIVE_NAME_MAX_LENGTH = 100;
const INITIAVIVE_SHORTNAME_MAX_LENGTH = 15;
const INITIAVIVE_DESCRIPTION_MAX_LENGTH = 500;

export function InitiativeGeneralInfo({
  sectionInfo,
  sectionUpdater,
  serverValidationErrors,
}: {
  sectionInfo: GeneralInfo;
  sectionUpdater: (value: GeneralInfo) => void;
  serverValidationErrors: { [key: string]: string[] };
}) {
  const [name, setName] = useState(sectionInfo.name ?? "");
  const [shortName, setShortName] = useState(sectionInfo.shortName ?? "");
  const [description, setDescription] = useState(sectionInfo.description ?? "");
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    setName(sectionInfo.name);
    setShortName(sectionInfo.shortName);
    setDescription(sectionInfo.description);
  }, [sectionInfo.name, sectionInfo.shortName, sectionInfo.description]);

  useEffect(() => {
    sectionUpdater({ name, shortName, description });
  }, [name, shortName, description, sectionUpdater]);

  const validationOnBlur = useCallback(
    (
      fieldName: string,
      res: StrValidator,
      fieldSetter: Dispatch<SetStateAction<string>>,
    ) => {
      const [cleanValue, errors] = res.result;

      if (errors.length > 0) {
        setInputErr((oldErr) => ({
          ...oldErr,
          [fieldName]: [
            ...errors,
            ...(serverValidationErrors?.[fieldName] ?? []),
          ],
        }));
        return;
      }

      setInputErr(({ [fieldName]: _, ...oldErr }) => oldErr);
      fieldSetter(cleanValue);
    },
    [serverValidationErrors],
  );

  const nameOnBlur = () =>
    validationOnBlur(
      "name",
      new StrValidator(name)
        .sanitize()
        .isRequired()
        .hasLengthLessOrEqualThan(INITIAVIVE_NAME_MAX_LENGTH),
      setName,
    );

  const shortNameOnBlur = () =>
    validationOnBlur(
      "shortName",
      new StrValidator(shortName)
        .isOptional()
        .sanitize()
        .hasLengthLessOrEqualThan(INITIAVIVE_SHORTNAME_MAX_LENGTH),
      setName,
    );

  const descriptionOnBlur = () =>
    validationOnBlur(
      "description",
      new StrValidator(description)
        .sanitize()
        .isRequired()
        .hasLengthLessOrEqualThan(INITIAVIVE_DESCRIPTION_MAX_LENGTH),
      setName,
    );

  return (
    <>
      <div className="flex flex-wrap items-end gap-4 [&>label]:flex-1 [&>label]:my-1 [&>label]:first:flex-2 [&>label]:min-w-[200px]">
        <label htmlFor="name">
          <TextAndErrorForLabel validationErrors={inputErr.name ?? []}>
            Nombre completo *
          </TextAndErrorForLabel>
          <InputGroup>
            <InputGroupInput
              name="name"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={nameOnBlur}
              autoComplete="off"
              placeholder="Juntos por la Amazonía"
              maxLength={INITIAVIVE_NAME_MAX_LENGTH}
              aria-invalid={inputErr.name !== undefined}
            />
            <InputGroupAddon
              align="inline-end"
              className={inputWarnColor(name, INITIAVIVE_NAME_MAX_LENGTH)}
            >
              {inputLengthCount(name, INITIAVIVE_NAME_MAX_LENGTH)}
            </InputGroupAddon>
          </InputGroup>
        </label>

        <label htmlFor="shortName">
          <TextAndErrorForLabel validationErrors={inputErr.shortName ?? []}>
            Nombre corto
          </TextAndErrorForLabel>
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
        </label>
      </div>

      <label htmlFor="description">
        <TextAndErrorForLabel validationErrors={inputErr.description ?? []}>
          Descripción *
        </TextAndErrorForLabel>

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
      </label>
    </>
  );
}
