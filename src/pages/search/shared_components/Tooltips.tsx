import { Tooltip } from "@mui/material";

import withStyles from "@mui/styles/withStyles";

export const InfoTooltip = withStyles({
  tooltip: {
    backgroundColor: "#000000",
    color: "#ffffff",
    maxWidth: 500,
    fontSize: 13,
    padding: "20px",
  },
})(Tooltip);

export const IconTooltip = withStyles({
  tooltip: {
    backgroundColor: "#000000",
    color: "#ffffff",
    fontSize: 13,
  },
})(Tooltip);
