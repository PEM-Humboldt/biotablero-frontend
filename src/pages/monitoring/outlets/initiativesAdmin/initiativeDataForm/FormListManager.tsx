import { type ElementType, useEffect, useState } from "react";
import type { ItemEditorProps } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { LegendAndErrors } from "@ui/LabelingWithErrors";
import { cn } from "@ui/shadCN/lib/utils";
import { DisplayTable } from "pages/monitoring/outlets/initiativesAdmin/initiativeDataForm/DisplayTable";

type FormListManagerProps<T, R extends object> = {
  title: string;
  sectionInfo: T[];
  AddItemComponent: ElementType<ItemEditorProps<T>>;
  maxItems: number;
  renderMap: Map<string, keyof R>;
  renderRowCallback?: (item: T) => Promise<R | null>;
  sectionUpdater: (value: T[]) => void;
  validationErrors: string[];
};

/**
 * A generic list manager component that handles the lifecycle of a collection of items.
 * It displays, adds, edits, and delete items while synchronizing with a parent container.
 *
 * @template T - The raw data type stored in the list.
 * @template R - The object type used for display purposes.
 *
 * @param title - The label for the fieldset legend.
 * @param sectionInfo - The initial state of the list.
 * @param AddItemComponent - Component rendered to handle the addition or update of an item.
 * @param maxItems - Limit of items allowed. If 0, the limit is Infinity.
 * @param renderMap - A Map defining the columns to display ([col name - property name of R or T if no renderRowCallback is provided]).
 * @param renderRowCallback - Transform function to convert type T into type R.
 * @param sectionUpdater - Function to sync the internal list with the parent container.
 * @param props.validationErrors - Array of error messages to trigger be visualized.
 */
export function FormListManager<T, R extends object>({
  title,
  sectionInfo,
  AddItemComponent,
  maxItems,
  renderMap,
  renderRowCallback,
  sectionUpdater,
  validationErrors,
}: FormListManagerProps<T, R>) {
  const [selectedItems, setSelectedItems] = useState<T[]>(sectionInfo);
  const [updateItem, setUpdateItem] = useState<T | null>(null);
  const totalItems = maxItems === 0 ? Infinity : maxItems;

  useEffect(() => {
    sectionUpdater(selectedItems);
  }, [selectedItems, sectionUpdater]);

  const handleEdit = (itemIndex: number) => {
    setUpdateItem({ ...selectedItems[itemIndex] });
    setSelectedItems((oldItems) => [
      ...oldItems.slice(0, itemIndex),
      ...oldItems.slice(itemIndex + 1),
    ]);
  };

  const handleDelete = (itemIndex: number) => {
    setSelectedItems((oldItems) => [
      ...oldItems.slice(0, itemIndex),
      ...oldItems.slice(itemIndex + 1),
    ]);
  };

  const handleSave: (newItem: T) => void = (newItem) => {
    setSelectedItems((oldItems) => [...oldItems, newItem]);
    setUpdateItem(null);
  };

  return (
    <fieldset
      className={cn(
        "px-4 pt-3 pb-4 rounded-lg",
        validationErrors.length > 0
          ? "bg-red-50 outline-2 outline-accent"
          : "bg-muted",
      )}
    >
      <LegendAndErrors validationErrors={validationErrors}>
        {title}
      </LegendAndErrors>

      {selectedItems.length > 0 && (
        <DisplayTable<T, R>
          title="Información lista para guardar"
          items={selectedItems}
          editItem={handleEdit}
          deleteItem={handleDelete}
          rowInfoCallback={renderRowCallback}
          render={renderMap}
          edit={updateItem === null}
        />
      )}

      {selectedItems.length < totalItems && (
        <AddItemComponent
          selectedItems={selectedItems}
          setter={handleSave}
          update={updateItem}
        />
      )}
    </fieldset>
  );
}
