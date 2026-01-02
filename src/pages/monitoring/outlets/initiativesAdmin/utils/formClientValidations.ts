import type { FormClientValidation } from "pages/monitoring/outlets/initiativesAdmin/types/form";

export const formClientValidations: FormClientValidation[] = [
  {
    condition: (f) => f.general.name !== undefined && f.general.name !== "",
    path: "general",
    child: "name",
    message: "La iniciativa debe tener un nombre",
  },
  {
    condition: (f) =>
      f.general.description !== undefined && f.general.description !== "",
    path: "general",
    child: "description",
    message: "La iniciativa debe tener una descripción",
  },
  {
    condition: (f) => f.locations.length > 0,
    path: "locations",
    message: "La iniciativa debe tener al menos una locación asignada",
  },
  {
    condition: (f) => f.contacts.length > 0,
    path: "contacts",
    message: "La iniciativa debe tener al menos un correo de contacto",
  },
  {
    condition: (f) => f.users.length > 0,
    path: "users",
    message: "La iniciativa debe tener al menos un lider o lidereza asignado",
  },
];
