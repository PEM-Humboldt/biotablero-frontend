import { SvgIcon } from "@mui/material";

const PolygonIcon = ({
  color = "",
  fontSize = 24,
}: {
  color?: string;
  fontSize?: number;
}) => (
  <SvgIcon viewBox="76 18 24 24" style={{ color, fontSize }}>
    <path d="M100 24.6 97.9 39.4 83.1 42 76 28.8 86.5 18Z" />
  </SvgIcon>
);

export default PolygonIcon;
