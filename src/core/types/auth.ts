export type TokenInfo = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  realm_access?: { roles: string[] };
  preferred_username?: string;
};
