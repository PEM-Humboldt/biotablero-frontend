import { useCallback, useEffect, useRef, useState } from "react";

import AccordionUI from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import type { AccordionComponent } from "pages/search/types/ui";

interface AccordionProps {
  componentsArray: AccordionComponent[];
  classNameSelected: string;
  classNameDefault: string;
  handleChange: (
    level: string,
    expandedTab: string,
    expandedTabLabel?: string,
  ) => void;
  level: string;
}

export function SearchAccordion({
  componentsArray,
  classNameSelected = "m0b selector-expanded",
  classNameDefault = "m0b",
  handleChange,
  level = "1",
}: AccordionProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const componentsArrayRef = useRef<AccordionComponent[] | null>(null);

  const setDefaultTab = useCallback(() => {
    const defaultTab = componentsArray.find((item) => !item.label.collapsed);
    const defaultTabId = defaultTab ? defaultTab.label.id : "";

    setExpanded(defaultTabId);
  }, [componentsArray]);

  useEffect(() => {
    const prevComponents = componentsArrayRef.current;

    if (!prevComponents) {
      if (componentsArray.length > 0) {
        setDefaultTab();
      }
    } else {
      const prvSection = prevComponents.find((cmp) => !cmp.label.collapsed);
      const curSection = componentsArray.find((cmp) => !cmp.label.collapsed);

      if (prvSection?.label.collapsed !== curSection?.label.collapsed) {
        setDefaultTab();
      }
    }

    componentsArrayRef.current = componentsArray;
  }, [componentsArray, setDefaultTab]);

  const handleAccordionChange = (item: AccordionComponent) => {
    const expandedTab = expanded !== item.label.id ? item.label.id : "";
    const expandedTabLevel =
      typeof item.label.name === "string" ? item.label.name : undefined;

    setExpanded(expandedTab);
    handleChange(level, expandedTab, expandedTabLevel);
  };

  return (
    <>
      {componentsArray.length <= 0 && (
        <div className="graphcard">
          <h2>Gráficas en construcción</h2>
          <p>Pronto más información</p>
        </div>
      )}

      {componentsArray.map((item) => (
        <AccordionUI
          className={
            expanded !== item.label.id ? classNameDefault : classNameSelected
          }
          expanded={expanded === item.label.id}
          id={item.label.id}
          key={item.label.id}
          onChange={() => handleAccordionChange(item)}
          TransitionProps={{ unmountOnExit: true }}
          disabled={item.label.disabled}
        >
          <AccordionSummary
            expandIcon={
              item.label.icon ? <item.label.icon /> : <ExpandMoreIcon />
            }
          >
            {item.label.name}
          </AccordionSummary>

          <AccordionDetails>
            {item.component && <item.component {...item.componentProps} />}
          </AccordionDetails>
        </AccordionUI>
      ))}
    </>
  );
}
