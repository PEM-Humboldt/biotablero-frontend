import { SearchBarComponent } from "@appTypes/odata";
import { MonitoringEvent } from "pages/monitoring/types/monitoringEvents";

export const monitoringEventsSearchBarComponents: SearchBarComponent<MonitoringEvent>[] =
  [
    {
      type: "date",
      dateOperator: "ge",
      source: ["date"],
      label: "Entre...",
      placeholder: "Inicio del rango",
    },
    {
      type: "date",
      dateOperator: "le",
      source: ["date"],
      label: "y el...",
      placeholder: "fin del rango",
    },
  ];
