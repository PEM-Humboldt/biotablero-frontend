import { type ElementType, useContext, useEffect, useState } from "react";
import type {
  CardInfoGrouped,
  ItemEditorProps,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { cn } from "@ui/shadCN/lib/utils";
import { DisplayTable } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/DisplayTable";
import { EditModeButton } from "pages/monitoring/outlets/initiativesAdmin/initiativeCard/EditModeButton";

import {
  isMonitoringAPIError,
  monitoringAPI,
} from "pages/monitoring/api/monitoringAPI";
import { ErrorsList } from "@ui/LabelingWithErrors";
import {
  InitiativeCtx,
  type InitiativeCtxType,
} from "pages/monitoring/outlets/initiativesAdmin/InitiativeCard";
import { commonErrorMessage } from "@utils/ui";

type FormListUpdaterProps<T, R extends object> = {
  title: string;
  listName: keyof CardInfoGrouped;
  AddItemComponent: ElementType<ItemEditorProps<T>>;
  maxItems: number;
  minItems?: number;
  renderCols: Map<string, keyof R>;
  renderRowsCallback?: (item: T) => R | null | Promise<R | null>;
  backEndpoint: string;
};

export function FormListUpdater<T, R extends object>({
  title,
  listName,
  AddItemComponent,
  maxItems = Infinity,
  minItems = 0,
  renderCols,
  renderRowsCallback,
  backEndpoint,
}: FormListUpdaterProps<T, R>) {
  const { initiative, updater, currentEdit, setCurrentEdit } =
    useContext<InitiativeCtxType>(InitiativeCtx);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [updateItem, setUpdateItem] = useState<T | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const edit = currentEdit === listName;
  const maxAmountItems = maxItems === 0 ? Infinity : maxItems;

  useEffect(() => {
    const sectionInfo = initiative
      ? (initiative[listName] as unknown as T[])
      : null;

    if (!sectionInfo) {
      return;
    }

    if (!renderRowsCallback) {
      setSelectedItems(sectionInfo);
      return;
    }

    const setInfo = async () => {
      const res = await Promise.all(sectionInfo.map(renderRowsCallback));
      const allLocations = res.filter((item) => item !== null) as T[];
      setSelectedItems(allLocations);
    };

    void setInfo();
  }, [renderRowsCallback, initiative, listName]);

  useEffect(() => {
    if (!edit && updateItem) {
      const hangingItem = { ...updateItem };
      setUpdateItem(null);
      setSelectedItems((oldItems) => [...oldItems, hangingItem]);
    }
  }, [edit, updateItem]);

  if (!initiative || !updater) {
    return null;
  }

  const isEditable = initiative.general.enabled;
  const viewEditPanel = isEditable && edit;
  const updateInitiativeCallback = updater || null;
  const initiativeId = initiative ? initiative.id : null;

  console.log(viewEditPanel);

  const getItemId = (item: T | null): number | null => {
    if (
      !item ||
      typeof item !== "object" ||
      !("id" in item) ||
      typeof item.id !== "number"
    ) {
      return null;
    }
    return item.id;
  };

  const removeItem = async (itemId: number) => {
    try {
      setIsLoading(true);
      const res = await monitoringAPI({
        type: "delete",
        endpoint: `${backEndpoint}/${itemId}`,
        getStatus: true,
      });

      if (isMonitoringAPIError(res)) {
        const { status, message, data } = res;
        setErrors((oldErr) => [
          ...oldErr,
          data || commonErrorMessage[status] || message,
        ]);

        return;
      }

      if (res.status > 299) {
        setErrors((oldErr) => [
          ...oldErr,
          "Actualiza la ventana para confirmar la acción",
        ]);
        return;
      }

      await updateInitiativeCallback();
    } catch (err) {
      setErrors((oldErr) => [...oldErr, "Error interno de la app"]);
      console.error("Critical error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave: (itemInfo: T) => Promise<void> = async (itemInfo) => {
    try {
      setIsLoading(true);
      const itemId = getItemId(updateItem);

      const res = await monitoringAPI<T>({
        type: itemId ? "post" : "put",
        endpoint: itemId ? `${backEndpoint}/${itemId}` : backEndpoint,
        options: {
          data: { ...itemInfo, initiativeId: initiativeId ?? "" },
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      });

      if (isMonitoringAPIError(res)) {
        const { status, message, data } = res;
        setErrors((oldErr) => [
          ...oldErr,
          data || commonErrorMessage[status] || message,
        ]);

        return;
      }

      const itemRender = renderRowsCallback
        ? (renderRowsCallback(res) as unknown as T)
        : res;

      setUpdateItem(null);
      setSelectedItems((oldItems) => [...oldItems, itemRender]);
      await updateInitiativeCallback();
    } catch (err) {
      setErrors((oldErr) => [...oldErr, "Error interno de la app"]);
      console.error("Critical error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (itemIndex: number) => {
    if (isLoading) {
      return;
    }

    const itemId = getItemId(selectedItems[itemIndex]);
    if (!itemId) {
      setErrors((oldErr) => [
        ...oldErr,
        "Ocurrió un problema al realizar la acción, vuelve a cargarla página.",
      ]);
      return;
    }

    await removeItem(itemId);

    setSelectedItems((oldItems) => [
      ...oldItems.slice(0, itemIndex),
      ...oldItems.slice(itemIndex + 1),
    ]);
  };

  const handleDiscard: () => Promise<void> = async () => {
    if (isLoading) {
      return;
    }

    const itemId = getItemId(updateItem);
    if (!itemId) {
      setErrors((oldErr) => [
        ...oldErr,
        "Ocurrió un problema al realizar la acción, vuelve a cargarla página.",
      ]);
      return;
    }

    await removeItem(itemId);
    setUpdateItem(null);
  };

  const handleEdit = (itemId: number) => {
    if (isLoading) {
      return;
    }

    setUpdateItem(selectedItems[itemId]);
    setSelectedItems((oldItems) => [
      ...oldItems.slice(0, itemId),
      ...oldItems.slice(itemId + 1),
    ]);
  };

  const editPanelAction = () => {
    setCurrentEdit!((curEdit) => (curEdit === listName ? null : listName));

    if (!edit && updateItem) {
      const hangingItem = { ...updateItem };
      setUpdateItem(null);
      setSelectedItems((oldItems) => [...oldItems, hangingItem]);
    }
  };

  return (
    <div
      className={cn(
        "p-2 rounded-lg",
        viewEditPanel ? "bg-muted outline-2 outline-primary" : "",
      )}
    >
      <div
        id={`${initiativeId}_${listName}`}
        className="font-normal flex flex-wrap gap-2 text-primary items-center text-lg pb-1"
      >
        {title}
        {isEditable && (
          <EditModeButton state={edit} setState={() => editPanelAction()} />
        )}
        {viewEditPanel && selectedItems.length <= minItems && (
          <div className="text-right font-light text-base flex-1 text-foreground">
            Siempre deben haber al menos {minItems} elemento
            {minItems > 1 && "s"}.
          </div>
        )}
      </div>

      <form aria-labelledby={`${initiativeId}_${listName}`}>
        <ErrorsList errId="id" errorItems={errors} />
        {selectedItems.length > 0 && (
          <DisplayTable<T, R>
            title="Información en la iniciativa"
            items={selectedItems}
            editItem={handleEdit}
            deleteItem={(itemIndex) => void handleRemove(itemIndex)}
            render={renderCols}
            edit={viewEditPanel && selectedItems.length > minItems}
          />
        )}

        {viewEditPanel && selectedItems.length < maxAmountItems && (
          <AddItemComponent
            selectedItems={selectedItems}
            setter={(n) => void handleSave(n)}
            update={updateItem}
            discard={() => void handleDiscard()}
          />
        )}
      </form>
    </div>
  );
}
