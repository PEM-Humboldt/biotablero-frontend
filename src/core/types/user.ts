export type UserProfile = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  autorreconocimiento: string;
  picture: string;
  genero: string;
  organizacion: string;
};

export type UserKeycloak = {
  sub: string;
  lastName: string;
  email_verified: boolean;
  autorreconocimiento: string;
  roles: string[];
  preferred_username: string;
  given_name: string;
  picture: string;
  firstName: string;
  genero: string;
  name: string;
  organizacion: string;
  family_name: string;
  email: string;
  username: string;
};
