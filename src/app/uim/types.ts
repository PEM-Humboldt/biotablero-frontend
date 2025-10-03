export type Tokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

export type Role = "Admin" | "User";

export type Company = {
  id: number;
  name: string;
};

export type UserType = {
  roles: Role[];
  username: string;
  email: string;
  // Sacar estos campos del token
  company?: Company;
  name?: string;
  profileImg?: string;
};
