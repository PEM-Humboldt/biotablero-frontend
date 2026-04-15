import {
  Eye,
  EyeClosed,
  Pencil,
  Star,
  PencilOff,
  type LucideIcon,
  StarOff,
} from "lucide-react";

export const uiText = {
  loading: "Cargando...",
  noStorys: "No hay historias disponibles",
  editMode: "Editando...",
  storyBy: "Por: ",
  storyByDateSeparator: ", ",

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
