import { getTags } from "pages/indicators/utils/firebase";
import { useEffect, useState } from "react";

export const useCardTags = () => {
  const [tags, setTags] = useState<Map<string, string[]>>(new Map());
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await getTags();
        setTags(tagsData);
      } catch (err) {
        console.error("cannot get tags data:", err);
      } finally {
        setIsLoadingTags(false);
      }
    };

    void fetchTags();
  }, []);

  return { isLoadingTags, tags };
};
