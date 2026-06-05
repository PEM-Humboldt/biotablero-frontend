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
    "sub" in info &&
    "username" in info &&
    "email" in info &&
    "firstName" in info &&
    "lastName" in info &&
    "roles" in info &&
    Array.isArray(info.roles) &&
    "picture" in info &&
    "autorreconocimiento" in info &&
    "genero" in info &&
    "organizacion" in info &&
    "email_verified" in info &&
    typeof info.email_verified === "boolean" &&
    "preferred_username" in info &&
    "given_name" in info &&
    "name" in info &&
    "family_name" in info
  );
}
