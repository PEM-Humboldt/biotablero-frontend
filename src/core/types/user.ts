export type UserProfile = {
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  attributes?: Record<string, string[]>;
  roles: string[];
};

// FIX: Borrar al terminar la implementación
export type Tokens = {
  accessToken: string | null;
  refreshToken: string | null;
};
