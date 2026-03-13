import { type SetStateAction, useCallback, useEffect, useState } from "react";

import { Label } from "@ui/shadCN/component/label";
import { LabelAndErrors } from "@ui/LabelingWithErrors";
import { Combobox } from "@ui/ComboBox";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { StrValidator } from "@utils/strValidator";
import { inputLengthCount, inputWarnColor } from "@utils/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@ui/shadCN/component/input-group";
import { INITIATIVE_LOCALITY_MAX_LENGTH } from "@config/monitoring";

import {
  isLocationObj,
  TagDataBasic,
  type LocationDataBasic,
} from "pages/monitoring/types/initiative";
import {
  getColombianDepartments,
  getMunicipalitiesByDepartment,
} from "pages/monitoring/utils/manageLocation";
import type { ItemEditorProps } from "pages/monitoring/types/initiativeData";
import { locationAlreadyExist } from "pages/monitoring/ui/initiativesAdmin/utils/fieldClientValidations";
import { fetchAndMakeLocationObj } from "pages/monitoring/ui/initiativesAdmin/utils/builders";
import { InputListActionButtons } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/InputListActionButtons";
import { uiText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";
import { getTags } from "pages/monitoring/api/services/tags";
import { ODataTagInfo } from "pages/monitoring/types/odataResponse";

export function TagInput<T extends TagDataBasic>({
  selectedItems,
  setter,
  update,
  discard,
  disabled = false,
}: ItemEditorProps<T>) {
  const [tags, setTags] = useState<ODataTagInfo | null>(null);
  const [currentTag, setCurrentTag] = useState<number | null>(null);
  const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getTags({});

      if (isMonitoringAPIError(tags)) {
        return;
      }

      setTags(tags);
    };

    void fetchTags();
  }, []);

  useEffect(() => {
  }, [currentTag]);

  const reset = useCallback(async () => {
    setInputErr({});

    if (update === null) {
      setCurrentTag(null);
      return;
    }

  }, [update]);

  useEffect(() => {
    void reset();
  }, [reset]);

  const handleSave = () => {
  };

  const handleDiscard = () => {
    if (update && discard) {
      discard();
    }
    setCurrentTag(null);

    setInputErr({});
  };

  return (
    <>
      <LabelAndErrors
        errID="errors_tag"
        validationErrors={inputErr.tag ?? []}
        htmlFor="tag"
      >
        {inputErr?.tag && (
          <span className="sr-only">
            {uiText.initiative.module.tags.label}
          </span>
        )}
      </LabelAndErrors>

      <div className="form-input-list">
        <Combobox
          id="tag"
          items={tags?.value ?? []}
          value={currentTag ?? 0}
          setValue={(e) => console.log(e)}
          keys={{ forValue: "id", forLabel: "name" }}
          uiText={{
            itemNotFound:
              uiText.initiative.module.tags.notFound,
            trigger: uiText.initiative.module.tags.trigger,
            inputPlaceholder:
              uiText.initiative.module.tags.placeholder,
          }}
          aria-required="true"
          aria-invalid={inputErr.tag !== undefined}
          aria-describedby={inputErr.tag ? "errors_tag" : undefined}
        />

        <InputListActionButtons
          update={update}
          handleSave={handleSave}
          handleDiscard={handleDiscard}
          reset={() => void reset()}
          disabled={disabled}
        />
      </div>
    </>
  );
}
