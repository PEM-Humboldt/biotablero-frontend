import { type FormEvent, useCallback, useRef, useState } from "react";

import { Button } from "@ui/shadCN/component/button";
import { commonErrorMessage } from "@utils/ui";

import {
  isMonitoringAPIError,
  monitoringAPI,
} from "pages/monitoring/api/monitoringAPI";
import { uiText } from "./layout/uiText";
import { TagDataForm, TagDataFormErr } from "./types/tagData";
import { makeInitialInfo, setFormField } from "./utils/formObjectUpdate";
import { tagValidations } from "./utils/formClientValidations";
import { validateFormClient } from "../initiativesAdmin/utils/validateFormClient";

export function TagForm({ onSuccess }: { onSuccess: () => void }) {
  const [formID, setformID] = useState(0);
  const [errors, setErrors] = useState<Partial<TagDataFormErr>>({});
  const [isLoading, setIsLoading] = useState(false);
  const formData = useRef<TagDataForm>(makeInitialInfo());

  const handleFormUpdate = useCallback(
    <K extends keyof TagDataForm>(key: K) => setFormField(formData, key),
    [],
  );

  const handleFormReset = () => {
    formData.current = makeInitialInfo();
    setformID((prev) => prev + 1);
    setErrors({});
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const currentErrors = validateFormClient(formData.current, tagValidations);
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const payload: TagDataForm = {
        name: formData.current.name,
        url: formData.current.url,
        category: formData.current.category,
      };

      const res = await monitoringAPI<TagDataForm>({
        type: "put",
        endpoint: "tag",
        options: {
          data: payload,
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      });

      if (isMonitoringAPIError(res)) {
        const { status, message, data } = res;
        setErrors((oldErr) => ({
          ...oldErr,
          root: [
            `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
          ],
        }));
        console.error(res);

        return;
      }

      onSuccess();
    } catch (err) {
      setErrors((oldErr) => ({ ...oldErr, root: [uiText.criticalError.user] }));
      console.error(uiText.criticalError.log, err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full rounded-xl bg-white overflow-hidden">
      <h4 className="px-6 py-2 mb-0 text-base bg-primary text-primary-foreground">
        Nueva etiqueta
      </h4>

      <form
        action=""
        key={formID}
        onReset={handleFormReset}
        onSubmit={(e) => void handleSubmit(e)}
        className="flex flex-col gap-2 p-6"
      >
        <div className="flex flex-row-reverse flex-wrap justify-between gap-4 mt-2">
          <Button disabled={isLoading}>
            {isLoading ? uiText.tag.creatingNew : uiText.tag.createNew}
          </Button>
          <Button
            type="reset"
            variant="outline_destructive"
            disabled={isLoading}
          >
            {uiText.restartForm}
          </Button>
        </div>
      </form>
    </div>
  );
}
