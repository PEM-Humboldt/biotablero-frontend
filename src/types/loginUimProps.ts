interface CompanyTypes {
  id: number;
}

export interface UserTypes {
  company?: CompanyTypes;
  id: number;
  name: string;
  username: string;
}

export interface LoginUimProps {
  setUser: (res: UserTypes | null) => void;
}
