import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React from "react";

export interface ComponentProps {
  handleAccordionChange?: (
    level: string,
    tabLayerId: string,
    expandedTab?: string,
  ) => void;
  openTab?: string;
}

export interface AccordionComponent {
  label: {
    id: string;
    name: React.ReactNode;
    icon?:
      | string
      | (OverridableComponent<SvgIconTypeMap> & { muiName: string });
    disabled?: boolean;
    collapsed?: boolean;
    expandIcon?: {};
    detailId?: string;
    description?: string;
  };
  component?: React.ComponentType<any>; // TODO: Arreglar este any, debe ser un tipo
  componentProps?: any; // TODO: Arreglar este any, debe ser un tipo
  defaultTab?: string;
}
