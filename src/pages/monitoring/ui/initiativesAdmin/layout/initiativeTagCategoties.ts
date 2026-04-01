import {
  INITIATIVE_TAGS_LIMIT_CULTURAL_CTX,
  INITIATIVE_TAGS_LIMIT_POLITICAL_CTX,
} from "@config/monitoring";

export const initiativeTagCategories: {
  tagCategoryId: number;
  title: string;
  maxTagsAmount: number;
  uiText: { itemNotFound: string; trigger: string; inputPlaceholder: string };
}[] = [
  {
    tagCategoryId: 3,
    title: "Contexto político",
    maxTagsAmount: INITIATIVE_TAGS_LIMIT_POLITICAL_CTX,
    uiText: {
      itemNotFound:
        "No hay coincidencias, para solicitar la creación de esa etiqueta, escribe a info@biotablero.humboldt.org.co",
      trigger: "Añadir etiqueta de contexto político",
      inputPlaceholder: "¿Cómo se llama la etiqueta que buscas?",
    },
  },
  {
    tagCategoryId: 2,
    title: "Contexto social",
    maxTagsAmount: INITIATIVE_TAGS_LIMIT_CULTURAL_CTX,
    uiText: {
      itemNotFound:
        "No hay coincidencias, para solicitar la creación de esa etiqueta, escribe a info@biotablero.humboldt.org.co",
      trigger: "Añadir etiqueta de contexto social",
      inputPlaceholder: "¿Cómo se llama la etiqueta que buscas?",
    },
  },
];
