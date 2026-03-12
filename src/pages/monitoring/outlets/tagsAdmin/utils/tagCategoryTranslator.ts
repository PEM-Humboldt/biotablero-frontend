import { uiText } from "pages/monitoring/outlets/tagsAdmin/layout/uiText";

/**
 * Translate English tag category name to Spanish
 * @param tagCategoryName Original tag category name
 * @returns Translated tag category name
 */
export function translateTagCategory(tagCategoryName: string): string {
    return (uiText.categoryTranslations as Record<string, string>)[
        tagCategoryName
    ] || tagCategoryName;
}
