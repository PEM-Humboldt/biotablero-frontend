import type { FormClientValidation } from "pages/monitoring/outlets/initiativesAdmin/types/form";

export const formClientValidations: FormClientValidation[] = [
  {
    condition: (f) => Boolean(f.general.name) || Boolean(f.general.description),
    path: "general/root",
    message: "Faltan campos por diligenciar.",
  },
  {
    condition: (f) => Boolean(f.general.name),
    path: "general/name",
    message: "La iniciativa debe tener un nombre.",
  },
  {
    condition: (f) => Boolean(f.general.description),
    path: "general/description",
    message: "La iniciativa debe tener una descripción.",
  },
  {
    condition: (f) => f.locations.length > 0,
    path: "locations",
    message: "Debe registrarse al menos una locación.",
  },
  {
    condition: (f) => f.contacts.length > 0,
    path: "contacts",
    message: "Debe registrarse al menos un correo de contacto.",
  },
  {
    condition: (f) => f.users.length > 0,
    path: "users",
    message: "Debe registrarse al menos un lider o lidereza.",
  },
];
