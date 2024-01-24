import React from "react";
import AccordionUI from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { accordionComponent } from "pages/search/types/ui";

interface Props {
  componentsArray: Array<accordionComponent>;
  classNameSelected: string;
  classNameDefault: string;
  handleChange: (
    level: string,
    tabLayerId: string,
    expandedTab?: string
  ) => void;
  level: string;
}

interface State {
  expanded: string | null;
}

class Accordion extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: null,
    };
  }

  componentDidMount() {
    const { componentsArray } = this.props;
    if (componentsArray.length > 0) {
      this.setDefaultTab();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { componentsArray: prevArray } = prevProps;
    const { componentsArray } = this.props;
    if (prevArray.length === 0 && componentsArray.length > 0) {
      this.setDefaultTab();
    }
  }

  setDefaultTab = () => {
    let defaultTabId: string;
    const { componentsArray } = this.props;
    let defaultTab = componentsArray.find((item) => !item.label.collapsed);
    if (defaultTab) {
      defaultTabId = defaultTab.label.id;
    } else {
      defaultTabId = "";
    }
    this.setState({ expanded: defaultTabId });
  };

  render() {
    const {
      componentsArray,
      classNameSelected = "m0b selector-expanded",
      classNameDefault = "m0b",
      handleChange,
      level = "1",
    } = this.props;
    const { expanded } = this.state;
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
            onChange={() => {
              const expandedTab =
                expanded !== item.label.id ? item.label.id : "";
              this.setState({ expanded: expandedTab });
              handleChange(level, expandedTab);
            }}
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
}

export default Accordion;
