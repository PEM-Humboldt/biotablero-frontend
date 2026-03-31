import {
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@ui/shadCN/lib/utils";

import type {
  CardInfoGrouped,
  InitiativeDataFormErr,
} from "pages/monitoring/types/initiativeData";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { EditModeButton } from "pages/monitoring/ui/initiativesAdmin/initiativeCard/EditModeButton";
import { ImagePreview } from "pages/monitoring/ui/initiativesAdmin/initiativeCard/ImagePreview";
import { ImagesInput } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/ImagesInput";
import { Button } from "@ui/shadCN/component/button";
import { uploadImages } from "pages/monitoring/api/services/assets";
import { uiText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";
import { useInitiativeDataCTX } from "pages/monitoring/ui/initiativesAdmin/hooks/useAdminUpdateContext";
import { TagsManger } from "../initiativeDataForm/TagsManager";

type TagsUpdaterProps = {
  title: string;
};
export function TagsUpdater({ title }: TagsUpdaterProps) {
  const { initiative, updater, currentEdit, setCurrentEdit } =
    useInitiativeDataCTX();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<InitiativeDataFormErr>>({});
  const [forceRender, setForceRender] = useState(0);

  const sectionInfo = useRef<CardInfoGrouped["tags"] | null>(null);
  const initiativeId = initiative?.id ?? null;
  const editThis = currentEdit === "tags";

  const reset = useCallback(() => {
    sectionInfo.current = initiative ? [...initiative.tags] : null;
    setForceRender((n) => n + 1);
  }, [initiative]);

  useEffect(() => {
    reset();
  }, [reset]);

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const updateInfo = useCallback((newInfo: CardInfoGrouped["tags"]) => {
    sectionInfo.current = { ...sectionInfo.current, ...newInfo };
  }, []);

  const editPanelAction = () => {
    setCurrentEdit!((curEdit) => (curEdit === "tags" ? "none" : "tags"));
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
        id={`${initiativeId}_${"images"}`}
        className="font-normal flex flex-wrap gap-2 text-primary items-center text-lg pb-1"
      >
        <h4 className="font-normal text-primary text-lg p-0! m-0!">{title}</h4>
        {currentEdit && (
          <EditModeButton state={editThis} setState={() => editPanelAction()} />
        )}
      </div>

      {!editThis ? (
        <div className="flex gap-x-8 gap-y-4 flex-wrap items-end *:flex-[1_1_350px]">
          previsual
        </div>
      ) : (
        <form aria-labelledby={`${initiativeId}_tags`}>
          <TagsManger
            sectionInfo={sectionInfo.current ?? []}
            sectionUpdater={updateInfo}
            validationErrors={[]}
            initiativeId={initiativeId}
          />
        </form>
      )}
    </div>
  );
}
