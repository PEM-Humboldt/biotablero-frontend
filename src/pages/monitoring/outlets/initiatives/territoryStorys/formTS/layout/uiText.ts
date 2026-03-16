export const uiText = {
  loading: "Cargando...",
  create: "Crear relato del territorio",
  edit: "Editar relato del territorio",

  errors: {
    createdButErrImageUpload:
      "El relato fue creado correctamente, pero sucedió un problema al subir las imágenes",
  },

  titleInput: {
    label: "Título",
    placeholder: "Este es el título de mi relato",
  },

  textEditor: {
    label: "El relato",
    placeholder: "Mi relato...",
  },

  keywords: {
    label: "Palabras clave",
    placeholder: "agrega una palabra oprimiendo enter",
    sr: "agrega una palabra oprimiendo enter",
    keywordCounter: (currentAmount: number, total: number) =>
      `${currentAmount} de ${total} palabras clave`,
  },

  imagesInput: {
    title: "Adjuntar imágenes",
    counter: (current: number, total: number) =>
      `${current} de ${total} imágenes`,
    image: {
      input: "Carga la imagen e ingresa la descipción",
      inputBtnSR: "Cargar imágen",
      inputLabel: "Selecciona una imagen",
      inputPreviewAlt: "Vista previa",
      removeSR: "Quitar imagen",
    },
    description: {
      label: "Descripcion de la imagen",
    },
    add: "Adjuntar imagen",
    imagesPool: {
      title: "Imágenes adjuntas",
      descriptionTileSR: (description: string) =>
        `Descripcion para la imagen: ${description}`,
      removeTitle: "Borrar la imagen",
      removeSR: "Borrar",
      quotaReached: "Limite de imágenes alcanzado",
    },
  },

  videosInput: {
    title: "Adjuntar videos de youtube",
    counter: (current: number, total: number) =>
      `${current} de ${total} videos`,
    input: {
      label: "Ingresa la url o el id del video de YouTube",
      placeholder: "url de youtube o id del video",
      upload: "Adjuntar video",
    },

    videosPool: {
      title: "Videos adjuntos",
      videoTitle: (videoTitle: string) => `Título: ${videoTitle}`,
      authorTitle: (author: string) => `Autor: ${author}`,
      openBtn: {
        title: "Abrir en una nueva ventana",
        label: "Abrir video",
      },
      removeBtn: { title: "Borrar video", sr: "Borrar" },
    },

    errorsYoutubeFeedback: {
      conection: (err: string) =>
        `${err}, no grabes y vuelve a cargar la página.`,
      purge: (url: string, why: string) =>
        `El video ${url} va a ser eliminado del relato: ${why}.\nPara mantenerlo en el relato, haz el video público o corrige el enlace, y vuelve a agregarlo.`,
      alreadyUploaded:
        "El video ya se encuentra dentro de los medios que hacen parte del relato",
    },
  },

  submitStory: {
    title: "Configuración del relato",
    restricted: {
      ariaLabel: "Restricción de público",
      title: {
        restricted:
          "El relato sólo está disponible a quienes hacen parte de la iniciativa",
        unrestricted: "El relato es público",
      },
      sr: {
        restricted: "Modo privado activo",
        unrestricted: "Modo público activo",
      },
      label: {
        restricted: "Sólo para personas en la iniciativa",
        unrestricted: "Cualquier persona puede leerlo",
      },
    },
    submit: {
      reset: "Reiniciar",
      save: "Guardar",
      publish: "Publicar",
    },
  },

  toast: {
    creation: {
      title: "Melo melo caramelo",
      description: (storyTitle: string) =>
        `El relato '${storyTitle}' fue creado con éxito`,
    },
    update: {
      title: "Melo remelo remelanie",
      description: (storyTitle: string) =>
        `El relato '${storyTitle}' fue actualizado con éxito`,
    },
  },
};
