import { type ElementType, useEffect, useState } from "react";
import type {
  ItemEditorProps,
  ItemsRenderProps,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

export function FormListManager<T>({
  sectionInfo,
  sectionUpdater,
  maxItems,
  CurrentItemsComponent,
  AddItemComponent,
  serverValidationErrors,
}: {
  sectionInfo: T[];
  sectionUpdater: (value: T[]) => void;
  maxItems: number;
  CurrentItemsComponent: ElementType<ItemsRenderProps<T>>;
  AddItemComponent: ElementType<ItemEditorProps<T>>;
  serverValidationErrors: { [key: string]: string[] };
}) {
  const [items, setItems] = useState<T[]>(sectionInfo);
  const [updateItem, setUpdateItem] = useState<T | null>(null);

  useEffect(() => {
    sectionUpdater(items);
    setUpdateItem(null);
  }, [items, sectionUpdater]);

  const handleEdit = (itemIndex: number) => {
    setUpdateItem({ ...items[itemIndex] });
    setItems((oldItems) => [
      ...oldItems.slice(0, itemIndex),
      ...oldItems.slice(itemIndex + 1),
    ]);
  };

  const handleDelete = (itemIndex: number) => {
    setItems((oldItems) => [
      ...oldItems.slice(0, itemIndex),
      ...oldItems.slice(itemIndex + 1),
    ]);
  };

  return (
    <>
      {items.length > 0 && (
        <CurrentItemsComponent
          items={items}
          editItem={handleEdit}
          deleteItem={handleDelete}
        />
      )}

      {items.length < maxItems && (
        <AddItemComponent setter={setItems} update={updateItem} />
      )}
    </>
  );
}
