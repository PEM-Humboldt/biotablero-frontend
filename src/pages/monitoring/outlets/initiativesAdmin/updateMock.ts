import { InitiativeToUpadate } from "./types/initiativeData";

export const updateMock: InitiativeToUpadate = {
  id: 5,
  name: "otra iniciativa",
  description: "mas ejemplos",
  creationDate: "2025-12-10T09:28:48.537861",
  coordinate: [-74.12464236300147, 4.763716427996729],
  polygonArea: 1626.256765,
  enabled: true,
  locations: [
    {
      id: 6,
      locationId: 3,
      location: {
        id: 3,
        name: "Bogotá, D.C.",
        code: "11",
      },
    },
    {
      id: 7,
      locationId: 182,
      locality: "rolotaaaa",
      location: {
        id: 182,
        name: "Bogotá, D.C.",
        code: "11001",
        parent: {
          id: 3,
          name: "Bogotá, D.C.",
          code: "11",
        },
      },
    },
  ],
  contacts: [
    {
      id: 6,
      initiativeId: 5,
      phone: "3055555555",
      email: "example@example.com",
    },
  ],
  users: [
    {
      id: 5,
      initiativeId: 5,
      userName: "general-admin",
      level: {
        id: 1,
        name: "Leader",
      },
      creationDate: "2025-12-19T12:53:59.158589",
    },
  ],
  tags: [],
};
