// import { uiText } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/territoryStoryReader/layout/uiText";

export const uiText = {
  loading: "Cargando...",

  reader: {
    loading: "Cargando relato...",
    errors: {
      unknown: "Algo inesperado ocurrió, vuelve a intentarlo más tarde.",
      noStory:
        "No pudimos encontrar el relato que buscas o sucedió algo inesperado al cargarlo.",
      unauthorized:
        "No tienes los permisos necesarios para leer este relato. Contacta al líder de la iniciativa.",
    },

    backToStoryList: {
      label: "Volver a los relatos del territorio",
      title: "Volver al explorador",
      sr: "Volver a los relatos del territorio",
    },

    prevStoryBtn: {
      label: "Anterior: ",
      title: "Leer el relato anterior",
      sr: "Leer el relato anterior:",
    },
    nextStoryBtn: {
      label: "Anterior: ",
      title: "Leer el relato anterior",
      sr: "Leer el relato anterior:",
    },

    mediaGallery: {
      images: {
        title: "Galería de imágenes",
        srGalleryDescription:
          "Visualizador de fotos y videos del relato actual. Usa las flechas para navegar entre el contenido.",
      },
      videos: {
        loading: "Cargando la información de los videos...",
        title: "Galería de videos",
        openLink: { title: "Abrir en Youtube" },
        srGalleryDescription: "Reproductor de videos de YouTube",
      },
    },
  },

  cardActions: { btn: { label: "leer", sr: "leer el relato" } },

  featuredCard: { titleSrDisclosure: "Relato destacado: " },

  storiesList: {
    loading: "Cargando los relatos...",
    noStories: "No se encontraron relatos que conincidan con tu búsqueda",
  },
};
