import type { ImageMimeType } from "@appTypes/formats";
import type { ODataParams } from "@appTypes/odata";
import type { LatLngBoundsLiteral } from "leaflet";

export const LOCALE = "es-ES";
// Logs
export const LOG_RECORDS_PER_PAGE = 20; // registrys on the logs summary

// Initiative description and properties
export const INITIATIVES_PER_PAGE = 10; // Initiatives on the admin panel

export const COUNTRY_BOUNDS: LatLngBoundsLiteral = [
  [-4.2316872, -82.1243666],
  [16.0571269, -66.85119073],
];

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
export const INITIATIVE_USER_FOCUS_AREA_LENGTH = 200;

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
export const INITIATIVES_IMG_MAX_FILE_SIZE = 2;

// Initiatives browser
export const INITIATIVES_MAP_PADDING_LG = {
  south: 50,
  north: 50,
  east: 150,
  west: 300,
};
export const INITIATIVES_MAP_PADDING_SM = {
  south: 100,
  north: 0,
  east: 20,
  west: 20,
};
export const INITIATIVES_MAP_GRADIENT = [
  { color: "#FDEBC4", position: 0 },
  { color: "#F1A49E", position: 0.5 },
  { color: "#B079A8", position: 1 },
];
export const INITIATIVES_MAP_STATS_BAR_HEIGHT = 20;
export const INITIATIVES_MAP_STATS_GRAPH_Y_MARGINS = 70;
export const INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD = [
  "#3d4469",
  "#315d90",
  "#3975a7",
  "#428ebd",
  "#4ca8d3",
  "#e5a85c",
  "#ed9054",
  "#f2784f",
  "#f25e50",
  "#e84a5f",
];

export const INITIATIVES_MAP_STATS_GRAPH_CONTRAST_MAP: Record<string, string> =
  {
    [INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[0]]: "#ffffff",
    [INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[1]]: "#ffffff",
    [INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[2]]: "#ffffff",
    [INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[3]]: "#ffffff",
    [INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[4]]: "#111111",
    [INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[5]]: "#111111",
    [INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[6]]: "#111111",
    [INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[7]]: "#111111",
    [INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[8]]: "#111111",
    [INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[9]]: "#ffffff",
  };

export const INITIATIVES_MAP_STATS_GRAPH_COLORS = [
  INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[9],
  INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[0],
  INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[5],
  INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[2],
  INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[7],
  INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[4],
  INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[1],
  INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[8],
];

// initiative admin
export const JOIN_REQUESTS_PER_PAGE = 10;

// Initiative Join Invitations
export const INITIATIVE_INVITATION_MESSAGE_MAX_LENGTH = 200;
export const INITIATIVE_INVITATIONS_SEND_PER_PAGE = 5;

// territoryStory
export const TERRITORY_STORIES_PER_PAGE = 20;
export const TERRITORY_STORIES_FROM_OTHER_INITIATIVE = 3;
export const TERRITORY_STORY_TITLE_MAX_LENGTH = 100;
export const TERRITORY_STORY_HEADINGS_OFFSET = 2;
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

// Tags
export const TAG_COLORS = [
  { bg: "[&_li]:bg-blue-200", fg: "[&_li]:text-blue-800" },
  { bg: "[&_li]:bg-green-100", fg: "[&_li]:text-green-800" },
  { bg: "[&_li]:bg-[#e5a85c]/20", fg: "[&_li]:text-[#f25e50]" },
  { bg: "[&_li]:bg-grey-light", fg: "[&_li]:text-grey-dark" },
  { bg: "[&_li]:bg-accent/10", fg: "[&_li]:text-foreground" },
];

// Tag admin
export const TAG_NAME_MAX_LENGTH = 40;
export const TAG_URL_MAX_LENGTH = 150;
export const TAG_RECORDS_PER_PAGE = 20;

// Resources
export const RESOURCES_PER_PAGE = 10;
export const RESOURCES_MAX_ITEMS_EDIT_LIST = 10;
export const RESOURCE_NAME_MIN_LENGTH = 3;
export const RESOURCE_NAME_MAX_LENGTH = 100;
export const RESOURCE_DESCRIPTION_MAX_LENGTH = 500;
export const RESOURCE_TAGS_LIMIT_ECOSYSTEM = 2;
export const RESOURCE_TAGS_LIMIT_BIOLOGICAL_GROUP = 2;
export const RESOURCE_ATTACHMENT_DESCRIPTION_MAX_LENGTH = 100;
export const RESOURCE_LINKS_MAX_AMOUNT = 10;
export const RESOURCE_LINK_MAX_LENGTH = 250;
export const RESOURCE_FILES_MAX_AMOUNT = 3;
export const RESOURCE_FILE_MAX_SIZE = 10; // size in megabytes;
export const RESOURCES_DEFAULT_TAGS_COMBOBOX_SEARCH_PARAMS: ODataParams = {
  orderby: "name asc",
};

// glosary
export const GLOSARY_FILTER_IS_AND = false;

// Indicators
export const INDICATORS_PER_PAGE = 5;
export const INDICATORS_MAX_AMOUNT_OCUPATION_SPECIES = 3;
export const INDICATORS_MAX_AMOUNT_RELATIONAL_INTENSITY = 3;
