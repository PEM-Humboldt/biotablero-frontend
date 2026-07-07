export type UserProfile = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  selfIdentification: string;
  picture: string;
  gender: string;
  organization: string;
};

export type UserKeycloak = {
  sub: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  picture: string;
  autorreconocimiento: string;
  genero: string;
  organizacion: string;
  email_verified: boolean;
  preferred_username: string;
  given_name: string;
  name: string;
  family_name: string;
};

export function isUserKeycloak(info: unknown): info is UserKeycloak {
  return (
    typeof info === "object" &&
    info !== null &&
    "username" in info &&
    "email" in info &&
    "roles" in info &&
    Array.isArray(info.roles)
  );
}
