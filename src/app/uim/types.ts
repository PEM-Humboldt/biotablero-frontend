export type Tokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

export type Role = "admin" | "user";

export type Company = {
  id: number;
  name: string;
};

export type UserType = {
  role: Role;
  username: string;
  email: string;
  // Sacar estos campos del token
  company?: Company;
  name?: string;
};
