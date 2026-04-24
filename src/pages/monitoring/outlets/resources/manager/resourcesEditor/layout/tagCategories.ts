import {
  RESOURCE_TAGS_LIMIT_BIOLOGICAL_GROUP,
  RESOURCE_TAGS_LIMIT_ECOSYSTEM,
} from "@config/monitoring";

export const resourceTagCategories: {
  tagCategoryId: number;
  title: string;
  maxTagsAmount: number;
  uiText: { itemNotFound: string; trigger: string; inputPlaceholder: string };
}[] = [
  {
    tagCategoryId: 3,
    title: "Grupo biológico",
    maxTagsAmount: RESOURCE_TAGS_LIMIT_ECOSYSTEM,
    uiText: {
      itemNotFound:
        "No hay coincidencias, para solicitar la creación de esa etiqueta, escribe a info@biotablero.humboldt.org.co",
      trigger: "Añadir etiqueta de grupo biológico",
      inputPlaceholder: "¿Cómo se llama la etiqueta que buscas?",
    },
  },
  {
    tagCategoryId: 4,
    title: "Ecosistemas",
    maxTagsAmount: RESOURCE_TAGS_LIMIT_BIOLOGICAL_GROUP,
    uiText: {
      itemNotFound:
        "No hay coincidencias, para solicitar la creación de esa etiqueta, escribe a info@biotablero.humboldt.org.co",
      trigger: "Añadir etiqueta de ecosistemas",
      inputPlaceholder: "¿Cómo se llama la etiqueta que buscas?",
    },
  },
];
