type LocationData = { locationId: number; locality: string };
type ContactData = { phone: string; email: string };
type UserData = { userName: string; level: { id: number; name: string } };

export type InitiativeDataForm = {
  name: string;
  shortName: string;
  description: string;
  locations: LocationData[];
  contacts: ContactData[];
  users: UserData[];
};

export interface InitiativeToUpadateForm extends InitiativeDataForm {
  id: number;
}
