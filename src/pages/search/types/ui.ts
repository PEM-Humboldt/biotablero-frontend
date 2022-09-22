import React from "react";

export interface componentProps {
  handleAccordionChange?: (
    level: string,
    tabLayerId: string,
    expandedTab?: string
  ) => void;
  openTab?: string;
}

export interface accordionComponent {
  label: {
    id: string;
    name: string;
    icon?: string;
    disabled?: boolean;
    collapsed?: boolean;
    expandIcon?: {};
    detailId?: string;
    description?: string;
  };
  component?: React.ComponentType<componentProps>;
  componentProps?: componentProps;
  defaultTab?: string;
}
