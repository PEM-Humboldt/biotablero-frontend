import { type ElementType, useEffect, useState } from "react";
import type {
  ItemEditorProps,
  ItemsRenderProps,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

export function FormListManager<T>({
  sectionInfo,
  sectionUpdater,
  maxItems,
  AddItemComponent,
  CurrentItemsComponent,
  serverValidationErrors,
}: {
  sectionInfo: T[];
  sectionUpdater: (value: T[]) => void;
  maxItems: number;
  AddItemComponent: ElementType<ItemEditorProps<T>>;
  CurrentItemsComponent: ElementType<ItemsRenderProps<T>>;
  serverValidationErrors: { [key: string]: string[] };
}) {
  const [selectedItems, setSelectedItems] = useState<T[]>(sectionInfo);
  const [updateItem, setUpdateItem] = useState<T | null>(null);

  useEffect(() => {
    sectionUpdater(selectedItems);
    setUpdateItem(null);
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

  return (
    <>
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
          setter={setSelectedItems}
          update={updateItem}
        />
      )}
    </>
  );
}
