type CompensationErrors = { title: string; description: string };

type CompensationTexts = {
  errors: { 
    restrictedAccess: CompensationErrors,
    unauthorizedUser: CompensationErrors, 
  };
};

export const uiText: CompensationTexts = {
  errors: {
    restrictedAccess: {
      title: "Acceso restringido",
      description: "Inicie sesión para acceder a la página.",
    },
    unauthorizedUser: {
      title: "Usuario no autorizado",
      description: "No tiene permisos para acceder a la página.",
    },
  },
};