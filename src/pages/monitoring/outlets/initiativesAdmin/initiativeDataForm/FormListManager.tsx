import {
  type Dispatch,
  type ElementType,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import type {
  ItemEditorProps,
  ItemsRenderProps,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { LegendAndErrors } from "@ui/LabelingWithErrors";
import { cn } from "@ui/shadCN/lib/utils";

export function FormListManager<T>({
  title,
  sectionInfo,
  sectionUpdater,
  maxItems,
  AddItemComponent,
  CurrentItemsComponent,
  validationErrors,
}: {
  title: string;
  sectionInfo: T[];
  sectionUpdater: (value: T[]) => void;
  maxItems: number;
  AddItemComponent: ElementType<ItemEditorProps<T>>;
  CurrentItemsComponent: ElementType<ItemsRenderProps<T>>;
  validationErrors: string[];
}) {
  const [selectedItems, setSelectedItems] = useState<T[]>(sectionInfo);
  const [updateItem, setUpdateItem] = useState<T | null>(null);

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

  const handleSave: Dispatch<SetStateAction<T[]>> = (value) => {
    setSelectedItems(value);
    setUpdateItem(null);
  };

  return (
    <fieldset
      className={cn(
        "px-4 pt-3 rounded-lg",
        validationErrors.length > 0
          ? "bg-red-50 outline-2 outline-accent"
          : "bg-muted",
      )}
    >
      <LegendAndErrors validationErrors={validationErrors}>
        {title}
      </LegendAndErrors>

      {selectedItems.length > 0 && (
        <CurrentItemsComponent
          selectedItems={selectedItems}
          editItem={handleEdit}
          deleteItem={handleDelete}
        />
      )}

      {selectedItems.length < maxItems && (
        <AddItemComponent
          selectedItems={selectedItems}
          setter={handleSave}
          update={updateItem}
        />
      )}
    </fieldset>
  );
}
