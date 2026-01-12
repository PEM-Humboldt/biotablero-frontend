import { useState, useEffect } from "react";
import { Button } from "@ui/shadCN/component/button";
import { SquarePen, Trash } from "lucide-react";

import type { TableRenderProps } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

export function DisplayTable<T, R extends object>({
  title,
  items,
  rowInfoCallback,
  editItem,
  deleteItem,
  render,
  edit,
}: TableRenderProps<T, R>) {
  const [displayItems, setDisplayItems] = useState<R[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!rowInfoCallback) {
      setDisplayItems(items as unknown as R[]);
      return;
    }

    setLoading(true);

    const fetchItems = async () => {
      try {
        const fetchedItems = await Promise.all(items.map(rowInfoCallback));

        if (isMounted) {
          setDisplayItems(fetchedItems.filter((i) => i !== null));
        }
      } catch (err) {
        console.error(err);
        isMounted = false;
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchItems();
    return () => {
      isMounted = false;
    };
  }, [rowInfoCallback, items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="table-form-display-container">
      {loading ? (
        <p>Cargando información...</p>
      ) : (
        <table className="table-form-display">
          <caption className="sr-only">{title}</caption>

          <thead>
            <tr>
              {[...render.keys()].map((colName) => (
                <th key={colName}>{colName}</th>
              ))}

              {edit && (
                <th className="w-24">
                  <span className="sr-only">Acciones</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {displayItems.map((row, i) => (
              <tr key={i}>
                {[...render.values()].map((colKey, j) => {
                  const value = row[colKey] ? String(row[colKey]) : "---";
                  return <td key={`${i}-${j}`}>{value}</td>;
                })}

                {edit && (
                  <td className="table-form-actions">
                    {editItem && (
                      <Button
                        type="button"
                        onClick={() => editItem(i)}
                        variant="ghost-clean"
                        size="icon-sm"
                        title="Editar"
                      >
                        <span className="sr-only">editar</span>
                        <span aria-hidden="true">
                          <SquarePen className="size-4" />
                        </span>
                      </Button>
                    )}

                    <Button
                      type="button"
                      onClick={() => deleteItem(i)}
                      variant="ghost-clean"
                      size="icon-sm"
                      title="Quitar"
                    >
                      <span className="sr-only">Quitar</span>
                      <span aria-hidden="true">
                        <Trash className="size-4" />
                      </span>
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
