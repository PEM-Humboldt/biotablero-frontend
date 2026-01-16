import type {
  CardInfoGrouped,
  InitiativeDataFormErr,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { cn } from "@ui/shadCN/lib/utils";
import {
  type MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  InitiativeCtx,
  type InitiativeCtxType,
} from "pages/monitoring/outlets/initiativesAdmin/InitiativeCard";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { EditModeButton } from "pages/monitoring/outlets/initiativesAdmin/initiativeCard/EditModeButton";
import { GeneralInfoInput } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/GeneralInfo";
import { Button } from "@ui/shadCN/component/button";
import {
  isMonitoringAPIError,
  monitoringAPI,
} from "pages/monitoring/api/monitoringAPI";
import { commonErrorMessage } from "@utils/ui";
import { validateFormClient } from "pages/monitoring/outlets/initiativesAdmin/utils/validateFormClient";
import { updateInitiativeGeneralValidations } from "pages/monitoring/outlets/initiativesAdmin/utils/formClientValidations";

type GeneralInfoUpdaterProps = {
  title: string;
  backEndpoint: string;
};
export function GeneralInfoUpdater({
  title,
  backEndpoint,
}: GeneralInfoUpdaterProps) {
  const { initiative, updater, currentEdit, setCurrentEdit } =
    useContext<InitiativeCtxType>(InitiativeCtx);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<InitiativeDataFormErr>>({});

  const sectionInfo = useRef<CardInfoGrouped["general"] | null>(null);
  const initiativeId = initiative?.id ?? null;
  const editThis = currentEdit === "general";

  const reset = useCallback(() => {
    sectionInfo.current = initiative ? { ...initiative.general } : null;
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
          influenceArea: sectionInfo.current.influenceArea,
        }).filter(([_, value]) => Boolean(value)),
      ) as Record<string, string>;

      const res = await monitoringAPI({
        type: "post",
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

      await updater!();
      setCurrentEdit!("none");
    } catch (err) {
      setErrors((oldErr) => ({ ...oldErr, root: ["Error interno de la app"] }));
      console.error("Critical error:", err);
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
            <h5 className="inline! text-primary">Nombre corto:</h5>{" "}
            {sectionInfo.current?.shortName ?? "Sin asignar"}
          </div>
          <div className="max-w-[65ch]">
            <h5 className="text-primary mb-0!">Descripción de la iniciativa</h5>
            {sectionInfo.current?.description}
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div className="flex-1 min-w-[350px] max-w-[65ch]">
              <h5 className="text-primary mb-0!">
                Objetivos y enfoque de la iniciativa
              </h5>
              {sectionInfo.current?.objective ?? "Sin asignar"}
            </div>
            <div className="flex-1 min-w-[300px] max-w-[65ch]">
              <h5 className="text-primary mb-0!">
                Contexto territorial y área de influencia
              </h5>
              {sectionInfo.current?.influenceArea ?? "Sin asignar"}
            </div>
          </div>
        </div>
      ) : (
        <form aria-labelledby={`${initiativeId}_${"general"}`}>
          <GeneralInfoInput
            sectionInfo={sectionInfo.current!}
            sectionUpdater={updateInfo}
            validationErrorsObj={errors.general ?? {}}
          />

          <ErrorsList
            errorItems={errors.root ?? []}
            className="bg-red-50 p-6 mt-4 rounded-lg md:w-[50%] ml-auto outline-2 outline-accent self-end"
          />

          <div className="flex flex-row-reverse gap-2 justify-between mt-4">
            <Button
              disabled={isLoading}
              type="button"
              onClick={(e) => void handleSubmit(e)}
            >
              {isLoading ? "Guadando cambios..." : "Guardar cambios"}
            </Button>
            <Button
              disabled={isLoading}
              type="button"
              variant="outline_destructive"
              onClick={() => undoChanges()}
            >
              Deshacer cambios
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
