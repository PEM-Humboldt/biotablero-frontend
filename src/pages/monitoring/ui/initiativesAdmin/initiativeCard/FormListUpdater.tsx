import { type ElementType, useContext, useEffect, useState } from "react";

import { commonErrorMessage } from "@utils/ui";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { cn } from "@ui/shadCN/lib/utils";

import type {
  CardInfoGrouped,
  ItemEditorProps,
} from "pages/monitoring/types/initiativeData";
import { DisplayTable } from "pages/monitoring/ui/initiativesAdmin/initiativeDataForm/DisplayTable";
import { EditModeButton } from "pages/monitoring/ui/initiativesAdmin/initiativeCard/EditModeButton";
import {
  isMonitoringAPIError,
  monitoringAPI,
} from "pages/monitoring/api/monitoringAPI";
import {
  InitiativeCtx,
  type InitiativeCtxType,
} from "pages/monitoring/outlets/initiativesAdmin/InitiativeCard";
import { uiText } from "pages/monitoring/ui/initiativesAdmin/layout/uiText";

type FormListUpdaterProps<T, R extends object> = {
  title: string;
  initiativeSection: keyof CardInfoGrouped;
  AddItemComponent: ElementType<ItemEditorProps<T>>;
  maxItems: number;
  minItems?: number;
  renderCols: Map<string, keyof R>;
  renderRowsCallback?: (item: T) => R | null | Promise<R | null>;
  backEndpoint: string;
};

/**
 * A specialized updater component for managing collections within an initiative with real-time API synchronization and UI blocking.
 *
 * @template T - The raw data type for each item
 * @template R - The object type used for display in the table.
 *
 * @param title - The label for the section header.
 * @param initiativeSection - The key of the initiative object to be managed.
 * @param AddItemComponent - The form component used to create or edit an individual item.
 * @param maxItems - Maximum number of items allowed (default: Infinity).
 * @param minItems - Minimum number of items required before allowing deletions (default: 0).
 * @param renderCols - A Map defining the table columns and their data mapping.
 * @param renderRowsCallback - Optional async transform function to prepare items for display.
 * @param backEndpoint - API base URL for handling the element actions
 */
export function FormListUpdater<T, R extends object>({
  title,
  initiativeSection,
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

  const initiativeId = initiative?.id ?? null;
  const maxAmountItems = maxItems === 0 ? Infinity : maxItems;
  const editThis = currentEdit === initiativeSection;

  useEffect(() => {
    setErrors([]);

    const sectionInfo = initiative
      ? (initiative[initiativeSection] as unknown as T[])
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
      const err: string[] = [];

      for (const response of res) {
        if (isMonitoringAPIError(response)) {
          const { status, message, data } = response;
          err.push(
            `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
          );
          console.error(response);
        }
      }

      if (err.length > 0) {
        setErrors((oldErr) => [...oldErr, ...err]);
        return;
      }

      const allLocations = res.filter((item) => item !== null) as T[];
      setSelectedItems(allLocations);
    };

    void setInfo();
  }, [renderRowsCallback, initiative, initiativeSection]);

  useEffect(() => {
    if (!editThis && updateItem) {
      setSelectedItems((oldItems) => [...oldItems, updateItem]);
      setUpdateItem(null);
    }
  }, [editThis, updateItem]);

  if (!initiative || !updater) {
    return null;
  }
  const updateInitiativeCallback = updater;

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
    setErrors([]);

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
          `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
        ]);
        console.error(res);

        return;
      }

      await updateInitiativeCallback();
    } catch (err) {
      setErrors((oldErr) => [...oldErr, uiText.criticalError.user]);
      console.error("Critical error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave: (itemInfo: T) => Promise<void> = async (itemInfo) => {
    setErrors([]);

    try {
      setIsLoading(true);
      const itemId = getItemId(updateItem);

      const res = await monitoringAPI<T>({
        type: itemId ? "put" : "post",
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
          `${commonErrorMessage[status] ?? message}${data ? `: ${data}` : "."}`,
        ]);
        console.error(res);

        return;
      }

      const itemRender = renderRowsCallback
        ? ((await renderRowsCallback(res)) as unknown as T)
        : res;

      setUpdateItem(null);
      setSelectedItems((oldItems) => [...oldItems, itemRender]);
      await updateInitiativeCallback();
    } catch (err) {
      setErrors((oldErr) => [...oldErr, uiText.criticalError.user]);
      console.error(uiText.criticalError.log, err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (itemIndex: number) => {
    setErrors([]);

    if (isLoading) {
      return;
    }

    const itemId = getItemId(selectedItems[itemIndex]);
    if (!itemId) {
      setErrors((oldErr) => [...oldErr, uiText.error.actionError]);
      return;
    }

    await removeItem(itemId);

    setSelectedItems((oldItems) => [
      ...oldItems.slice(0, itemIndex),
      ...oldItems.slice(itemIndex + 1),
    ]);
  };

  const handleDiscard: () => Promise<void> = async () => {
    setErrors([]);

    if (isLoading) {
      return;
    }

    const itemId = getItemId(updateItem);
    if (!itemId) {
      setErrors((oldErr) => [...oldErr, uiText.error.actionError]);
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
    setCurrentEdit!((curEdit) =>
      curEdit === initiativeSection ? "none" : initiativeSection,
    );
  };

  return (
    <div
      className={cn(
        "p-2 rounded-lg",
        editThis ? "bg-muted outline-2 outline-primary" : "",
      )}
    >
      <div
        id={`${initiativeId}_${initiativeSection}`}
        className="font-normal flex flex-wrap gap-2 text-primary items-center text-lg pb-1"
      >
        {title}
        {currentEdit && (
          <EditModeButton state={editThis} setState={() => editPanelAction()} />
        )}
        {editThis && selectedItems.length <= minItems && (
          <div className="text-right font-light text-base flex-1 text-foreground">
            {uiText.initiative.listManager.validation.minAmount(minItems)}
          </div>
        )}
      </div>

      <form aria-labelledby={`${initiativeId}_${initiativeSection}`}>
        <ErrorsList
          errId={`${initiativeId}_${initiativeSection}_errors`}
          errorItems={errors}
        />
        {selectedItems.length > 0 && (
          <DisplayTable<T, R>
            title="Información en la iniciativa"
            items={selectedItems}
            editItem={handleEdit}
            deleteItem={(itemIndex) => void handleRemove(itemIndex)}
            render={renderCols}
            edit={editThis && selectedItems.length > minItems}
            disabled={isLoading}
          />
        )}

        {editThis && selectedItems.length < maxAmountItems && (
          <AddItemComponent
            selectedItems={selectedItems}
            setter={(n) => void handleSave(n)}
            update={updateItem}
            discard={() => void handleDiscard()}
            disabled={isLoading}
          />
        )}
      </form>
    </div>
  );
}
