import {
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@ui/shadCN/lib/utils";
import { commonErrorMessage } from "@utils/ui";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { Button } from "@ui/shadCN/component/button";

import type {
  CardInfoGrouped,
  InitiativeDataFormErr,
} from "pages/monitoring/types/initiativeData";
import { EditModeButton } from "pages/monitoring/ui/initiativesAdmin/initiativeCard/EditModeButton";
import { GeneralInfoInput } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/GeneralInfo";
import {
  isMonitoringAPIError,
  monitoringAPI,
} from "pages/monitoring/api/monitoringAPI";
import { validateFormClient } from "pages/monitoring/ui/initiativesAdmin/utils/validateFormClient";
import { updateInitiativeGeneralValidations } from "pages/monitoring/ui/initiativesAdmin/utils/formClientValidations";
import { uiText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";
import { useInitiativeDataCTX } from "pages/monitoring/ui/initiativesAdmin/hooks/useAdminUpdateContext";

type GeneralInfoUpdaterProps = {
  title: string;
  backEndpoint: string;
};

export function GeneralInfoUpdater({
  title,
  backEndpoint,
}: GeneralInfoUpdaterProps) {
  const { initiative, updater, currentEdit, setCurrentEdit } =
    useInitiativeDataCTX();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<InitiativeDataFormErr>>({});
  const [forceRender, setForceRender] = useState(0);

  const sectionInfo = useRef<CardInfoGrouped["general"] | null>(null);
  const initiativeId = initiative?.id ?? null;
  const editThis = currentEdit === "general";

  const reset = useCallback(() => {
    sectionInfo.current = initiative ? { ...initiative.general } : null;
    setForceRender((n) => n + 1);
  }, [initiative]);

  useEffect(() => {
    reset();
  }, [reset]);

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isLoading || !sectionInfo.current) {
      return;
    }

    const currentErrors = validateFormClient(
      sectionInfo.current,
      updateInitiativeGeneralValidations,
    );
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const payload = Object.fromEntries(
        Object.entries({
          name: sectionInfo.current.name,
          shortName: sectionInfo.current.shortName,
          description: sectionInfo.current.description,
          objective: sectionInfo.current.objective,
          baseline: sectionInfo.current.baseline,
        }).filter(([_, value]) => Boolean(value)),
      ) as Record<string, string>;

      const res = await monitoringAPI({
        type: "put",
        endpoint: `${backEndpoint}/${initiativeId}`,
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

      setForceRender((n) => n + 1);
      await updater!();
      setCurrentEdit!("none");
    } catch (err) {
      setErrors((oldErr) => ({ ...oldErr, root: [uiText.criticalError.user] }));
      console.error(uiText.criticalError.log, err);
    } finally {
      setIsLoading(false);
    }
  };

  const undoChanges = () => {
    reset();
  };

  const updateInfo = (newInfo: CardInfoGrouped["general"]) => {
    sectionInfo.current = { ...sectionInfo.current, ...newInfo };
  };

  const editPanelAction = () => {
    setCurrentEdit!((curEdit) => (curEdit === "general" ? "none" : "general"));
    reset();
  };

  return (
    <div
      className={cn(
        "p-2 rounded-lg",
        editThis ? "bg-muted outline-2 outline-primary" : "",
      )}
    >
      <div
        id={`${initiativeId}_${"general"}`}
        className="font-normal flex flex-wrap gap-2 text-primary items-center text-lg pb-1"
      >
        <h4 className="font-normal text-primary text-lg p-0! m-0!">{title}</h4>
        {currentEdit && (
          <EditModeButton state={editThis} setState={() => editPanelAction()} />
        )}
      </div>

      {!editThis ? (
        <div className="flex flex-col gap-4">
          <div>
            <h5 className="inline! text-primary">
              {uiText.initiative.module.general.field.shortName}
            </h5>{" "}
            {sectionInfo.current?.shortName ??
              uiText.initiative.unasignedFallback}
          </div>
          <div className="max-w-[65ch]">
            <h5 className="text-primary mb-0!">
              {uiText.initiative.module.general.field.descriptionHelper}
            </h5>
            {sectionInfo.current?.description}
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div className="flex-1 min-w-[350px] max-w-[65ch]">
              <h5 className="text-primary mb-0!">
                {uiText.initiative.module.general.field.objectiveHelper}
              </h5>
              {sectionInfo.current?.objective ??
                uiText.initiative.unasignedFallback}
            </div>
            <div className="flex-1 min-w-[300px] max-w-[65ch]">
              <h5 className="text-primary mb-0!">
                {uiText.initiative.module.general.field.baselineHelper}
              </h5>
              {sectionInfo.current?.baseline ??
                uiText.initiative.unasignedFallback}
            </div>
          </div>
        </div>
      ) : (
        <form aria-labelledby={`${initiativeId}_${"general"}`}>
          <GeneralInfoInput
            key={forceRender}
            sectionInfo={sectionInfo.current!}
            sectionUpdater={updateInfo}
            validationErrorsObj={errors.general ?? {}}
            submitBlocker={setIsLoading}
          />

          <ErrorsList
            errorItems={errors.root ?? []}
            className="bg-red-50 p-6 mt-4 rounded-lg md:w-[50%] ml-auto outline-2 outline-accent self-end"
          />

          <div className="flex flex-row-reverse gap-2 justify-between mt-4">
            <Button
              disabled={isLoading}
              type="button"
              onClick={(e) => setTimeout(() => void handleSubmit(e), 0)}
              title={uiText.save}
            >
              {isLoading ? uiText.wait : uiText.save}
            </Button>
            <Button
              disabled={isLoading}
              type="button"
              variant="outline_destructive"
              onClick={() => undoChanges()}
              title={uiText.undo}
            >
              {uiText.undo}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
