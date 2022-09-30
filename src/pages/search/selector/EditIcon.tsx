import PropTypes from "prop-types";
import React from "react";

import { SvgIcon } from "@mui/material";

const EditIcon = ({
  color = "",
  fontSize = 24,
}: {
  color?: string;
  fontSize?: number;
}) => (
  <SvgIcon viewBox="318 17.8 24.7 24.2" style={{ color, fontSize }}>
    <path d="M337 30.2v6a3 3 0 1-3 3h-10a3 3 0 1-3-3v-10c0-1.7 1.3-3 3-3h6.3l3.2-3.2H324a6 6 0 0-6 6v10a6 6 0 6 6h10a6 6 0 6-6v-8.8l-3 3" />
    <path d="M338.7 24.6l-8.9 8.9H327V30.7l8.9-8.9z" />
    <path d="M338.7 17.8h4v4h-4z" />
    <path d="m337 30.2 0 0.4 0 5.6c0 1.7-1.3 3-3 3l-10 0c-1.7 0-3-1.3-3-3l0-10c0-1.7 1.3-3 3-3l6.3 0 3.2-3.2-9.5 0c-3.3 0-6 2.7-6 6l0 10c0 3.3 2.7 6 6 6l10 0c3.3 0 6-2.7 6-6l0-8.8-3 3" />
  </SvgIcon>
);

export default EditIcon;
