import { DrawMode } from "pages/search/layout/selector/drawPolygon/types";

export const uiText = {
  title: {
    [DrawMode.IDLE]: "Dibuje UN polígono para comenzar",
    [DrawMode.DRAW]: "Dibujando polígono...",
    [DrawMode.EDIT]: "Editando polígono...",
    [DrawMode.DELETE]: "Haga clic en el polígono para eliminarlo",
    [DrawMode.DONE]: "Polígono creado - Seleccione una acción",
  },
  drawButton: {
    title: "Dibujar polígono",
    instruction: {
      [DrawMode.IDLE]:
        "Haga clic aquí para activar. Luego dibuje UN polígono en el mapa (doble clic para finalizar).",
      [DrawMode.DRAW]:
        "Haga clic en el mapa para empezar a dibujar (doble clic para finalizar)",
      [DrawMode.DONE]: "✓ Polígono dibujado correctamente",
      [DrawMode.EDIT]: "✓ Polígono dibujado correctamente",
      [DrawMode.DELETE]: "✓ Polígono dibujado correctamente",
    },
  },
  editButton: {
    title: "Editar polígono",
    instruction: {
      [DrawMode.IDLE]: "Primero debe dibujar un polígono",
      [DrawMode.DRAW]: "Primero debe dibujar un polígono",
      [DrawMode.EDIT]: "Arrastre los puntos para modificar la forma",
      [DrawMode.DELETE]: "Primero debe dibujar un polígono",
      [DrawMode.DONE]: "Haga clic para activar el modo edición",
    },
  },
  removeButton: {
    title: "Borrar polígono",
    instruction: {
      [DrawMode.IDLE]: "Primero debe dibujar un polígono",
      [DrawMode.DRAW]: "Primero debe dibujar un polígono",
      [DrawMode.EDIT]: "Primero debe dibujar un polígono",
      [DrawMode.DELETE]: "Haga clic en el polígono del mapa para eliminarlo",
      [DrawMode.DONE]: "Eliminará el polígono actual del mapa",
    },
  },
  sendButton: {
    title: "Enviar consulta",
    instruction: {
      [DrawMode.IDLE]: "Primero debe dibujar un polígono",
      [DrawMode.DRAW]: "Complete la acción actual antes de enviar",
      [DrawMode.EDIT]: "Complete la acción actual antes de enviar",
      [DrawMode.DELETE]: "Complete la acción actual antes de enviar",
      [DrawMode.DONE]: "Procesar consulta con el polígono creado",
    },
  },
  secondaryButtons: {
    save: "Guardar cambios",
    cancel: "Cancelar cambios",
    confirmDelete: "Confirmar eliminación",
    cancelDelete: "Cancelar eliminación",
  },
};
