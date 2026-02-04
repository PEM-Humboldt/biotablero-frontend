export enum Request {
  UNDER_REVIEW = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export type UserRequestData = {
  initiativeId: number;
  userName: string;
  creationDate: Date;
  responseDate: Date | null;
};
