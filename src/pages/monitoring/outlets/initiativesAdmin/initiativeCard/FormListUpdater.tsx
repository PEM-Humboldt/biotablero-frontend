import { type ElementType, useContext, useEffect, useState } from "react";
import type {
  InitiativeFullInfo,
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
  InitiativeContext,
  type InitiativeContextType,
} from "pages/monitoring/outlets/initiativesAdmin/InitiativeCard";

type FormListUpdaterProps<T, R extends object> = {
  title: string;
  listName: keyof InitiativeFullInfo;
  AddItemComponent: ElementType<ItemEditorProps<T>>;
  maxItems: number;
  renderCols: Map<string, keyof R>;
  renderRowsCallback?: (item: T) => R | null | Promise<R | null>;
  backEndpoint: string;
  isEditable: boolean;
};

export function FormListUpdater<T, R extends object>({
  title,
  listName,
  AddItemComponent,
  maxItems,
  renderCols,
  renderRowsCallback,
  backEndpoint,
  isEditable,
}: FormListUpdaterProps<T, R>) {
  const [isLoading, setIsLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [updateItem, setUpdateItem] = useState<T | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const { initiative, updater } =
    useContext<InitiativeContextType>(InitiativeContext);

  const sectionInfo = initiative
    ? (initiative[listName] as unknown as T[])
    : null;

  useEffect(() => {
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
  }, [renderRowsCallback, sectionInfo]);

  if (!initiative || !updater) {
    return null;
  }

  const updateInitiativeCallback = updater || null;
  const totalItems = maxItems === 0 ? Infinity : maxItems;
  const initiativeId = initiative ? initiative.id : null;
  const viewEditPanel = isEditable && edit;

  const handleDelete = async (itemIndex: number) => {
    if (isLoading) {
      return;
    }

    const item = selectedItems[itemIndex];
    if (
      typeof item !== "object" ||
      !item ||
      !("id" in item) ||
      typeof item.id !== "number"
    ) {
      console.error("Item sin id válido");
      return;
    }

    const itemId = item.id;

    try {
      setIsLoading(true);
      const res = await monitoringAPI({
        type: "delete",
        endpoint: `${backEndpoint}/${itemId}`,
        getStatus: true,
      });

      if (isMonitoringAPIError(res)) {
        console.error("apiErr:", res);
        setErrors((oldErr) => [...oldErr, res.message]);
        return;
      }

      if (res.status > 299) {
        console.error("statusErr:", res);
        setErrors((oldErr) => [...oldErr, "pailas"]);
        return;
      }

      setSelectedItems((oldItems) => [
        ...oldItems.slice(0, itemIndex),
        ...oldItems.slice(itemIndex + 1),
      ]);

      await updateInitiativeCallback();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (itemId: number) => {
    setUpdateItem({ ...selectedItems[itemId] });
    setSelectedItems((oldItems) => [
      ...oldItems.slice(0, itemId),
      ...oldItems.slice(itemId + 1),
    ]);
  };

  const handleSave: (newItem: T) => Promise<void> = async (newItem) => {
    try {
      setIsLoading(true);

      const res = await monitoringAPI<T>({
        type: "put",
        endpoint: `${backEndpoint}`,

        options: {
          data: { ...newItem, initiativeId: initiativeId ?? "" },
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      });

      if (isMonitoringAPIError(res)) {
        console.error("pailas", res.message);
        return;
      }

      if (!newItem) {
        setErrors((oldErr) => [
          ...oldErr,
          "Se añadió el nuevo item pero no pudo renderizarse, actualiza la ventana para ver los cambios",
        ]);
      }

      const itemRender = renderRowsCallback
        ? (renderRowsCallback(res) as unknown as T)
        : res;

      setSelectedItems((oldItems) => [...oldItems, itemRender]);
      await updateInitiativeCallback();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard: (itemId: number) => Promise<void> = async (itemId) => {
    await handleDelete(itemId);
    setUpdateItem(null);
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
        className="font-normal flex flex-wrap gap-2 text-primary items-center text-lg pb-2"
      >
        {title}
        {isEditable && <EditModeButton state={edit} setState={setEdit} />}
      </div>

      <form aria-labelledby={`${initiativeId}_${listName}`}>
        <ErrorsList errId="id" errorItems={errors} />
        {selectedItems.length > 0 && (
          <DisplayTable<T, R>
            title="Información lista para guardar"
            items={selectedItems}
            editItem={handleEdit}
            deleteItem={(item) => void handleDelete(item)}
            render={renderCols}
            edit={viewEditPanel}
          />
        )}

        {viewEditPanel && selectedItems.length < totalItems && (
          <AddItemComponent
            selectedItems={selectedItems}
            setter={(n) => void handleSave(n)}
            update={updateItem}
            discard={(itemId) => void handleDiscard(itemId)}
          />
        )}
      </form>
    </div>
  );
}
