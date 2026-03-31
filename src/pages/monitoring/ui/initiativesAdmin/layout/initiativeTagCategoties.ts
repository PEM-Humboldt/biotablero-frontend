export const initiativeTagCategories: {
  tagCategoryId: number;
  title: string;
  maxTagsAmount: number;
  uiText: { itemNotFound: string; trigger: string; inputPlaceholder: string };
}[] = [
  {
    tagCategoryId: 3,
    title: "Contexto político",
    maxTagsAmount: 10,
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
    maxTagsAmount: 2,
    uiText: {
      itemNotFound:
        "No hay coincidencias, para solicitar la creación de esa etiqueta, escribe a info@biotablero.humboldt.org.co",
      trigger: "Añadir etiqueta de contexto social",
      inputPlaceholder: "¿Cómo se llama la etiqueta que buscas?",
    },
  },
];
