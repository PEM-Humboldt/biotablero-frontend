export interface UserType {
  id: number;
  name: string;
  username: string;
  company?: {
    id: number;
  };
}

export interface LoginUimProps {
  currentUser: UserType | null;
  setUser: (res: UserType | null) => void;
  logoutUser: () => void;
}
