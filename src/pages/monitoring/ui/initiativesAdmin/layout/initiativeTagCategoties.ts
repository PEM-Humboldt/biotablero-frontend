import {
  INITIATIVE_TAGS_LIMIT_CULTURAL_CTX,
  INITIATIVE_TAGS_LIMIT_POLITICAL_CTX,
  SUPPORT_EMAIL,
} from "@config/monitoring";

export const initiativeTagCategories: {
  tagCategoryId: number;
  title: string;
  maxTagsAmount: number;
  uiText: { itemNotFound: string; trigger: string; inputPlaceholder: string };
}[] = [
  {
    tagCategoryId: 1,
    title: "Contexto político",
    maxTagsAmount: INITIATIVE_TAGS_LIMIT_POLITICAL_CTX,
    uiText: {
      itemNotFound: `No hay coincidencias, para solicitar la creación de esa etiqueta, escribe a ${SUPPORT_EMAIL}`,
      trigger: "Añadir etiqueta de contexto político",
      inputPlaceholder: "¿Cómo se llama la etiqueta que buscas?",
    },
  },
  {
    tagCategoryId: 2,
    title: "Contexto social",
    maxTagsAmount: INITIATIVE_TAGS_LIMIT_CULTURAL_CTX,
    uiText: {
      itemNotFound: `No hay coincidencias, para solicitar la creación de esa etiqueta, escribe a ${SUPPORT_EMAIL}`,
      trigger: "Añadir etiqueta de contexto social",
      inputPlaceholder: "¿Cómo se llama la etiqueta que buscas?",
    },
  },
];
