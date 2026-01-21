import {
  HomeOutlined,
  SlideshowOutlined,
  ContactSupportOutlined,
  SearchOutlined,
} from "@mui/icons-material";

import type { DashboardItem } from "pages/monitoring/types/monitoring";

export const generalItems: DashboardItem[] = [
  { description: "Inicio", icon: <HomeOutlined />, linkTo: "/Monitoreo" },
  { description: "Buscar", icon: <SearchOutlined />, linkTo: "/" },
  { description: "Tutorial", icon: <SlideshowOutlined />, linkTo: "/" },
  {
    description: "Preguntas Frecuentes",
    icon: <ContactSupportOutlined />,
    linkTo: "/",
  },
];
