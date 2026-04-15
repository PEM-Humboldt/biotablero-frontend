import { Eye, EyeClosed, Pencil, Star, PencilOff, StarOff } from "lucide-react";
import backgroundImage from "pages/home/assets/biotablero-slider.webp";

export const uiText = {
  loading: "Cargando...",
  noStorys: "No hay historias disponibles",
  editMode: "Editando...",
  storyBy: "Por: ",
  storyByDateSeparator: ", ",

  header: {
    text: "Juntos construimos más historias que transforman iniciativas.",
    imgFallback: backgroundImage,
  },

  label: {
    disabledStory: "Relato no publicado",

    editButton: {
      disable: {
        sr: "Cancelar edición",
        title: "Cancelar edición",
        label: "",
        icon: PencilOff,
      },
      enable: {
        sr: "Editar relato",
        title: "Editar relato",
        label: "",
        icon: Pencil,
      },
    },

    enableButton: {
      disable: {
        sr: "Ocultar relato",
        title: "Ocultar relato",
        label: "",
        icon: Eye,
      },
      enable: {
        sr: "Publicar relato",
        title: "Publicar relato",
        label: "",
        icon: EyeClosed,
      },
    },

    featuredButton: {
      disable: {
        sr: "Quitar como destacado",
        title: "Quitar como destacado",
        label: "",
        icon: StarOff,
      },
      enable: {
        sr: "Marcar como relato destacado",
        title: "Marcar como relato destacado",
        label: "",
        icon: Star,
      },
    },
  },
};
