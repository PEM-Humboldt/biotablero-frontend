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
  id?: number;
  company?: Company;
  name?: string;
  profileImg?: string;
};

export function isUserType(user: unknown): user is UserType {
  return (
    user !== undefined &&
    user !== null &&
    typeof user === "object" &&
    "username" in user &&
    "email" in user &&
    "role" in user &&
    Array.isArray(user.role)
  );
}
