import type { ImageMimeType } from "@appTypes/formats";
import { ODataParams } from "@appTypes/odata";

export const LOG_RECORDS_PER_PAGE = 20; // registrys on the logs summary
export const INITIATIVES_PER_PAGE = 10; // Initiatives on the admin panel
export const LOGIN_URL = "/";

// Initiative description and properties

export const INITIAVIVE_NAME_MAX_LENGTH = 100;
export const INITIAVIVE_SHORTNAME_MAX_LENGTH = 120;
export const INITIAVIVE_DESCRIPTION_MAX_LENGTH = 300;
export const INITIAVIVE_OBJECTIVE_MAX_LENGTH = 1000;
export const INITIAVIVE_INFLUENCE_MAX_LENGTH = 1000;

export const INITIATIVE_LOCATIONS_MAX_AMOUNT = 0; // 0 for infinity
export const INITIATIVE_LOCATIONS_MIN_AMOUNT = 1;
export const INITIATIVE_LOCALITY_MAX_LENGTH = 300;

export const INITIATIVE_LEADERS_MAX_AMOUNT = 3;
export const INITIATIVE_LEADERS_MIN_AMOUNT = 1;
export const INITIATIVE_DISPLAY_LEADERS_SEARCH = 5;

export const INITIATIVE_CONTACTS_MAX_AMOUNT = 3;
export const INITIATIVE_CONTACTS_MIN_AMOUNT = 1;
export const INITIATIVE_EMAIL_MAX_LENGHT = 120;
export const INITIATIVE_PHONE_MAX_LENGHT = 10;

export const INITIATIVE_TAGS_LIMIT_POLITICAL_CTX = 10;
export const INITIATIVE_TAGS_LIMIT_CULTURAL_CTX = 3;
export const INITIATIVE_DEFAULT_TAGS_COMBOBOX_SEARCH_PARAMS: ODataParams = {
  orderby: "name asc",
};

export const INITIATIVES_IMG_ALLOWED_FORMATS: ImageMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
export const INITIATIVES_IMG_MAX_FILE_SIZE = 2; // size in megabytes

// initiative admin
export const JOIN_REQUESTS_PER_PAGE = 10;

// Initiative Join Invitations

export const INITIATIVE_INVITATION_MESSAGE_MAX_LENGTH = 200;

// territoryStory
export const TERRITORY_STORIES_PER_PAGE = 20;
export const TERRITORY_STORY_TITLE_MAX_LENGTH = 100;
export const TERRITORY_STORY_TEXT_MIN_LENGTH = 100;
export const TERRITORY_STORY_TEXT_MAX_LENGTH = 2000;
export const TERRITORY_STORY_KEYWORDS_MAX_AMOUNT = 4;
export const TERRITORY_STORY_KEYWORD_MAX_LENGTH = 75;
export const TERRITORY_STORY_IMG_MAX_AMOUNT = 6;
export const TERRITORY_STORY_IMG_DESCRIPTION_MAX_LENGTH = 150;
export const TERRITORY_STORY_IMG_MAX_FILE_SIZE = 20; // size in megabytes
export const TERRITORY_STORY_IMG_MAX_WIDTH = 1200; // size in pixels
export const TERRITORY_STORY_IMG_MAX_HEIGHT = 900; // size in pixels
export const TERRITORY_STORY_IMG_MIN_WIDTH = 300; // size in pixels
export const TERRITORY_STORY_IMG_MIN_HEIGHT = 300; // size in pixels
export const TERRITORY_STORY_YT_VID_MAX_AMOUNT = 6;

// Tag admin
export const TAG_NAME_MAX_LENGTH = 40;
export const TAG_URL_MAX_LENGTH = 150;
export const TAG_RECORDS_PER_PAGE = 20;
