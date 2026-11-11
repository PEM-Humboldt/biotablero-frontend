// import { uiText } from "pages/monitoring/outlets/initiativesAdmin/initiativeCard/monitoringEventsEditor/layout/uiText";
import {
  MONITORING_EVENTS_MAX_PER_MONTH,
  MONITORING_EVENTS_MIN_PER_MONTH,
} from "@config/monitoring";

export const uiText = {
  title: "Administrar los eventos de monitoreo comunitario",
  description: (
    initiativeName: string,
  ) => `Agrega, edita o elimina eventos de monitoreo comunitario realizados
          por la iniciativa '${initiativeName}'`,

  validationErrors: {
    invalidAmount: `debes ingresar un numero entre ${MONITORING_EVENTS_MIN_PER_MONTH} y ${MONITORING_EVENTS_MAX_PER_MONTH}.`,
    alreadyExist: "Ya existe un evento de monitoreo con esa fecha.",
  },

  newEventForm: {
    title: "Crear nuevo grupo de eventos de monitoreo",
    amountInput: {
      label: `¿Cuántos eventos de monitoreo se realizaron?`,
      placeholder: "1, 5, 25...",
    },
    dateLegend: "¿Cuándo sucedieron los eventos de monitoreo?",
    yearPlaceholder: "Año",
    monthPlaceholder: "Mes",

    createBtn: {
      sr: (_: boolean) => "Crear grupo de eventos de monitoreo comunitario",
      title: (_: boolean) => "Crear eventos de monitoreo",
      label: (loading: boolean) => (loading ? "Creando eventos..." : "Crear"),
    },

    resetBtn: {
      sr: "Reiniciar formulario",
      title: "Reiniciar",
      label: "Reiniciar",
    },
  },

  eventsList: {
    title: "Eventos de monitoreo registrados",

    searchBar: {
      submitLabel: "Filtrar",
      orderBtn: {
        sr: (asc: boolean) =>
          asc
            ? "Ordenar del más reciente al más lejano"
            : "Ordenar del más lejano al más reciente",
        title: (asc: boolean) =>
          asc
            ? "Ordenar del más reciente al más lejano"
            : "Ordenar del más lejano al más reciente",
      },
    },

    eventLabel: (date: string, value: number) =>
      `${value} eventos durante ${date}`,

    editPopup: {
      triggerBtn: {
        sr: "Editar la cantidad de eventos de monitoreo",
        title: "Editar la cantidad de eventos de monitoreo",
      },

      titleSr: "Actualizar evento de monitoreo",
      inputTexts: (date: string) => ({
        label: `¿Cuántos eventos de monitoreo se realizaron durante ${date}?`,
        placeholder: "1, 5, 100...",
      }),

      saveBtnLabel: "Guardar",
      resetBtnLabel: "Reiniciar",
      cancelBtnLabel: "Cancelar",
    },

    deleteEventBtn: {
      sr: "Borrar grupo de eventos de monitoreo",
      title: "Borrar grupo de eventos de monitoreo",
    },
  },
};
