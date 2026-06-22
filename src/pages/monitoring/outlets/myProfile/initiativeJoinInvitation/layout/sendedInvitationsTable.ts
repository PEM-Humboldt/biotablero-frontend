import type { ODataColumn } from "@appTypes/odata";
import type {
  GuestInvited,
  SendedJoinInitiativeInvitation,
} from "pages/monitoring/types/userJoinRequest";

export const sendedInvitationsTableStructure: ODataColumn<SendedJoinInitiativeInvitation>[] =
  [
    {
      name: "Fecha",
      source: "creationDate",
      type: "text",
      processValue: (date) => {
        const formatedDate = new Date(date as string);
        return formatedDate.toLocaleDateString() ?? date;
      },
    },
    {
      name: "Anfitrion",
      source: "creator",
      type: "text",
      sortBy: true,
    },
    {
      name: "Invitación enviada a",
      source: "guests",
      type: "text",
      sortBy: true,
      processValue: (guests) => {
        const guestsEmails = (guests as GuestInvited[]).map((g) => g.email);
        return guestsEmails.join(", ");
      },
    },
    {
      name: "Mensaje",
      source: "message",
      type: "text",
      sortBy: true,
    },
  ];
