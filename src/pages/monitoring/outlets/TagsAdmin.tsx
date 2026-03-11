import { useEffect, useState } from "react";

import { uiText } from "pages/monitoring/outlets/tagsAdmin/layout/uiText";
import { TagForm } from "pages/monitoring/outlets/tagsAdmin/TagForm";
import type { TagCategory } from "pages/monitoring/types/tagData";
import {
  isMonitoringAPIError,
  monitoringAPI,
} from "pages/monitoring/api/monitoringAPI";

export function TagsAdmin() {
  const [tagCategories, setTagCategories] = useState<TagCategory[]>([]);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [tagIdStr, setTagIdStr] = useState("");

  useEffect(() => {

    const fetchTagCategories = async () => {
      const result = await monitoringAPI<TagCategory[]>({
        type: "get",
        endpoint: "TagCategory",
      });

      if (isMonitoringAPIError(result)) {
        throw new Error(result.message);
      }

      setTagCategories(
        result.map((category) => ({
          ...category,
          name: (uiText.categoryTranslations as Record<string, string>)[category.name] || category.name,
        })),
      );
    };

    void fetchTagCategories();
  }, []);

  return (
    <main className="page-main">
      <header>
        <h3>{uiText.title}</h3>
      </header>

      <div className="flex gap-4 mt-6">
        <button
          className={`px-4 py-2 rounded-md ${mode === "create" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          onClick={() => setMode("create")}
        >
          Crear Etiqueta
        </button>
        <button
          className={`px-4 py-2 rounded-md ${mode === "edit" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          onClick={() => setMode("edit")}
        >
          Editar Etiqueta
        </button>
      </div>

      {mode === "edit" && (
        <div className="mt-4 max-w-[600px]">
          <label
            htmlFor="tagIdInput"
            className="block text-sm font-medium mb-1"
          >
            ID de la etiqueta a editar
          </label>
          <input
            id="tagIdInput"
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Ingrese el identificador"
            value={tagIdStr}
            onChange={(e) => setTagIdStr(e.target.value)}
          />
        </div>
      )}

      {mode === "create" ? (
        <TagForm tagCategories={tagCategories} mode="create" />
      ) : (
        <TagForm tagCategories={tagCategories} mode="edit" tagId={tagIdStr} />
      )}
    </main>
  );
}
