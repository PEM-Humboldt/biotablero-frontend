import { type ChangeEvent, useEffect, useState } from "react";

import { Input } from "@ui/shadCN/component/input";
import { Textarea } from "@ui/shadCN/component/textarea";
import { TextAndErrorForLabel } from "@ui/TextAndErrorForLabel";

import type { GeneralInfo } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupTextarea,
} from "@ui/shadCN/component/input-group";
import { inputLengthCount, inputWarnColor } from "@utils/ui";

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
  const [formValues, setFormValues] = useState({ ...sectionInfo });
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    sectionUpdater(formValues);
  }, [formValues, sectionUpdater]);

  useEffect(() => {
    const relevantErr: { [key: string]: string[] } = {};
    for (const key in sectionInfo) {
      if (key in serverValidationErrors) {
        relevantErr[key] = serverValidationErrors[key];
      }
    }
    setInputErr(relevantErr);
  }, [serverValidationErrors, sectionInfo]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormValues((oldForm) => ({ ...oldForm, [name]: value }));
  };

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
              value={formValues.name}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Juntos por la Amazonía"
              maxLength={INITIAVIVE_NAME_MAX_LENGTH}
              aria-invalid={inputErr.name !== undefined}
            />
            <InputGroupAddon
              align="inline-end"
              className={inputWarnColor(
                formValues.name,
                INITIAVIVE_NAME_MAX_LENGTH,
              )}
            >
              {inputLengthCount(formValues.name, INITIAVIVE_NAME_MAX_LENGTH)}
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
              value={formValues.shortName}
              onChange={handleChange}
              autoComplete="off"
              maxLength={INITIAVIVE_SHORTNAME_MAX_LENGTH}
              aria-invalid={inputErr.shortName !== undefined}
            />
            <InputGroupAddon
              align="inline-end"
              className={inputWarnColor(
                formValues.shortName,
                INITIAVIVE_SHORTNAME_MAX_LENGTH,
                0.8,
              )}
            >
              {inputLengthCount(
                formValues.shortName,
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
            value={formValues.description}
            onChange={handleChange}
            maxLength={INITIAVIVE_DESCRIPTION_MAX_LENGTH}
            aria-invalid={inputErr.description !== undefined}
          />
          <InputGroupAddon
            align="block-end"
            className={`${inputWarnColor(
              formValues.description,
              INITIAVIVE_DESCRIPTION_MAX_LENGTH,
              0.95,
            )} flex-row-reverse`}
          >
            {`${formValues.description.length} / ${INITIAVIVE_DESCRIPTION_MAX_LENGTH}
            `}
          </InputGroupAddon>
        </InputGroup>
      </label>
    </>
  );
}
