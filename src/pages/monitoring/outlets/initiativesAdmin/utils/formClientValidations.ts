import type { FormClientValidation } from "pages/monitoring/outlets/initiativesAdmin/types/form";
import type {
  CardInfoGrouped,
  InitiativeDataForm,
} from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";

export const newInitiativeValidations: FormClientValidation<InitiativeDataForm>[] =
  [
    {
      condition: (f) =>
        Boolean(f.general.name) || Boolean(f.general.description),
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

export const updateInitiativeGeneralValidations: FormClientValidation<
  CardInfoGrouped["general"]
>[] = [
  {
    condition: (f) => Boolean(f.name) || Boolean(f.description),
    path: "root",
    message: "Faltan campos por diligenciar.",
  },
  {
    condition: (f) => Boolean(f.name),
    path: "name",
    message: "La iniciativa debe tener un nombre.",
  },
  {
    condition: (f) => Boolean(f.description),
    path: "description",
    message: "La iniciativa debe tener una descripción.",
  },
];
