// import { uiText } from "pages/monitoring/outlets/initiatives/territoryStories/readTS/territoryStoryReader/layout/uiText";

export const textNumbers: Record<number, string> = {
  1: "una",
  2: "dos",
  3: "tres",
  4: "cuatro",
  5: "cinco",
};

export const uiText = {
  loading: "Cargando...",

  like: {
    noUser: 'Inicia sesión para poder dar "Me gusta"',
    first: 'Da el primer "Me gusta"',
    youLiked: "A tí te gusta",
    btn: {
      title: "Me gusta",
      label: "Me gusta",
      sr: "Dar 'Me gusta' a este relato",
    },
    btnDisabled: (likes: number) => {
      const totalCount = textNumbers[likes] ?? likes;
      const totalPlural = likes === 1 ? "" : "s";
      return `A ${totalCount} persona${totalPlural} le${totalPlural} gusta`;
    },
    btnIlikedIt: (likes: number) => {
      const plural = likes === 1 ? "" : "s";
      const countStr = textNumbers[likes] ?? likes;
      return `A ti y a ${countStr} persona${plural} más les gusta este relato`;
    },
    btnLegend: (likes: number) => {
      const plural = likes === 1 ? "" : "s";
      const countStr = textNumbers[likes] ?? likes;
      return `A ${countStr} persona${plural} le${plural} gusta este relato`;
    },
  },

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
