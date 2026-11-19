import { tagCategories } from "pages/monitoring/layout/commonDictionary";

/**
 * Translate English tag category name to Spanish
 * @param tagCategoryName Original tag category name
 * @returns Translated tag category name
 */
export function translateTagCategory(tagCategoryName: string): string {
  return (
    (tagCategories as Record<string, string>)[tagCategoryName] ||
    tagCategoryName
  );
}
