import { SvgIcon } from "@mui/material";

const RemoveIcon = ({
  color = "",
  fontSize = 24,
}: {
  color?: string;
  fontSize?: number;
}) => (
  <SvgIcon viewBox="16 16 22 26" style={{ color, fontSize }}>
    <path d="m18 42 18 0 0-18-18 0 0 18zm14-16 2 0 0 14-2 0 0-14zm-4 0 2 0 0 14-2 0 0-14zm-4 0 2 0 0 14-2 0 0-14zm-4 0 2 0 0 14-2 0 0-14z" />
    <path d="m32 20 0-4-10 0 0 4-6 0 0 2 22 0 0-2-6 0zm-2 0-6 0 0-2 6 0 0 2z" />
  </SvgIcon>
);

export default RemoveIcon;
