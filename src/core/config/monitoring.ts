import type { ImageMimeType } from "@appTypes/formats";

export const LOG_RECORDS_PER_PAGE = 4; // registrys on the logs summary
export const INITIATIVES_PER_PAGE = 10; // Initiatives on the admin panel
export const LOGS_ELEMENT_ID = "logsElement"; // The Id to render the log detail card

// Initiatives

export const INITIAVIVE_NAME_MAX_LENGTH = 100;
export const INITIAVIVE_SHORTNAME_MAX_LENGTH = 15;
export const INITIAVIVE_DESCRIPTION_MAX_LENGTH = 500;
export const INITIAVIVE_OBJECTIVE_MAX_LENGTH = 1000;
export const INITIAVIVE_INFLUENCE_MAX_LENGTH = 1000;

export const INITIATIVE_LOCATIONS_MAX_AMOUNT = 0; // if 0, no max amount is setted;
export const INITIATIVE_LOCALITY_MAX_LENGTH = 300;

export const INITIATIVE_LEADERS_MAX_AMOUNT = 3;
export const INITIATIVE_DISPLAY_LEADERS_SEARCH = 5;

export const INITIATIVE_CONTACTS_MAX_AMOUNT = 3;
export const INITIATIVE_EMAIL_MAX_LENGHT = 120;
export const INITIATIVE_PHONE_MAX_LENGHT = 10;

export const INITIATIVES_IMG_ALLOWED_FORMATS: ImageMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
