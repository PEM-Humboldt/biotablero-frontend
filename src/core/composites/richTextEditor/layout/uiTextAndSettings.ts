import {
  MessageSquareQuote,
  Link,
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo2,
  Redo2,
} from "lucide-react";
import type { RenderSelector } from "@composites/richTextEditor/toolbar/types/items";

// Headings
export const HEADINGS_OFFSET = 2;
export const headingRange = [1, 2, 3, 4];

type SupportedBlockTypes = "p" | `h${number}`;

export const blockTypes: Map<SupportedBlockTypes, string> = new Map([
  ["p", "Párrafo"],
  ...headingRange.map((range): [SupportedBlockTypes, string] => [
    `h${range + HEADINGS_OFFSET}`,
    `Título nivel ${range} (Ctrl+Alt+${range})`,
  ]),
]);

// Listas
export type SupportedListTypes = "ul" | "ol";
export const listTypes: Map<SupportedListTypes, RenderSelector> = new Map([
  ["ul", { label: "Crear lista", icon: List }],
  ["ol", { label: "Crear lista ordenada", icon: ListOrdered }],
]);

// Formato de texto
export type SupportedTextFormats = "bold" | "italic";
export const textFormats: Map<SupportedTextFormats, RenderSelector> = new Map([
  ["bold", { label: "Negrita (Ctrl+B)", icon: Bold }],
  ["italic", { label: "Cursiva (Ctrl+I)", icon: Italic }],
]);

// Estructuras de texto
export const structureModifications = {
  quote: { label: "Insertar cita", icon: MessageSquareQuote },
  link: { label: "Insertar enlace", icon: Link },
};

export const uiText = {
  placeholderDefault: "Escribe aquí...",
  history: {
    undo: { title: "Deshacer (Ctrl+Z)", sr: "Deshacer", icon: Undo2 },
    redo: { title: "Rehacer (Ctrl+Y)", sr: "Rehacer", icon: Redo2 },
  },

  linkObject: {
    edit: "Editar enlace",
    new: "Insertar enlace",
    remove: "Eliminar enlace",
    confirm: { new: "Crear enlace", update: "Actualizar enlace" },

    inputText: {
      label: "Texto para el enlace",
      placeholder: "el nombre del sitio",
    },

    inputUrl: {
      label: "Enlace de destino",
      placeholder: "https://www.mi-ejemplo.com",
    },
  },
};
