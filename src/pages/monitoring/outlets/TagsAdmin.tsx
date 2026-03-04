import { useEffect, useState } from "react";

import { useUserCTX } from "@hooks/UserContext";
import { uiText } from "./tagsAdmin/layout/uiText";
import { TagForm } from "./tagsAdmin/TagForm";
import { TagCategory } from "./tagsAdmin/types/tagData";
import { isMonitoringAPIError, monitoringAPI } from "../api/monitoringAPI";

export function TagsAdmin() {
  const { user } = useUserCTX();
  const [tagCategories, setTagCategories] = useState<TagCategory[]>([]);

  useEffect(() => {
    if (!user?.username) {
      return;
    }

    const fetchTagCategories = async () => {
      const result = await monitoringAPI<TagCategory[]>({
        type: "get",
        endpoint: "TagCategory",
      });

      if (isMonitoringAPIError(result)) {
        throw new Error(result.message);
      }

      setTagCategories(result);
    };

    void fetchTagCategories();
  }, [user?.username]);

  return (
    <main className="page-main">
      <header>
        <h3>{uiText.title}</h3>
      </header>

      <TagForm tagCategories={tagCategories} />
    </main>
  );
}
