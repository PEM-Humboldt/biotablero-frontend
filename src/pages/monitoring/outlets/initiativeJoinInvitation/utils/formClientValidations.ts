export type InitiativeInvitationFormState = {
  initiativeId: string;
  guestEmail: string;
  customMessage: string;
};

export type InitiativeInvitationFormErr = {
  initiative?: string[];
  email?: string[];
  message?: string[];
  root?: string[];
};

export type FormClientValidation<T, E> = {
  condition: (data: T) => boolean;
  message: string;
  path: keyof E;
};

export const invitationValidations: FormClientValidation<
  InitiativeInvitationFormState,
  InitiativeInvitationFormErr
>[] = [
    {
      condition: (f) => Boolean(f.initiativeId),
      path: "initiative",
      message: "Debes seleccionar una iniciativa.",
    },
    {
      condition: (f) => {
        const emails = f.guestEmail
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e !== "");
        return emails.length > 0;
      },
      path: "email",
      message: "Debes ingresar al menos un correo electrónico válido.",
    },
    {
      condition: (f) => {
        const emails = f.guestEmail
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e !== "");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emails.length === 0) return true;
        return emails.every((email) => emailRegex.test(email));
      },
      path: "email",
      message: "Los correos no tienen un formato válido",
    },
  ];

export function validateInvitationForm(
  formData: InitiativeInvitationFormState,
): InitiativeInvitationFormErr {
  const foundErrors: InitiativeInvitationFormErr = {};

  for (const validation of invitationValidations) {
    if (validation.condition(formData)) {
      continue;
    }

    const { path, message } = validation;

    if (!foundErrors[path]) {
      foundErrors[path] = [];
    }
    foundErrors[path]!.push(message);
  }

  return foundErrors;
}
