import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";

import Accordion from "pages/search/Accordion";
import DrawPolygon from "pages/search/selector/DrawPolygon";
import SearchAreas from "pages/search/selector/SearchAreas";

import isFlagEnabled from "utils/isFlagEnabled";
import selectorMessage from "pages/search/selector/errorMessages";

const Selector = (props) => {
  const { areasData, description, handlers, messages } = props;
  const [drawPolygonFlag, setDrawPolygonFlag] = useState(true);

  useEffect(() => {
    isFlagEnabled("drawPolygon").then((value) => setDrawPolygonFlag(value));
  }, []);

  const sections = [
    {
      label: {
        id: "panel1-Geocerca",
        name: "Área de consulta",
      },
      component: messages.defAreas
        ? selectorMessage(messages.defAreas)
        : SearchAreas,
      componentProps: {
        areaList: areasData,
        onChange: handlers.areaTypeChange,
        onSelection: handlers.geofenceChange,
      },
    },
    {
      label: {
        id: "draw-polygon",
        name: "Dibujar polígono",
        icon: EditIcon,
        disabled: !drawPolygonFlag,
      },
      component: messages.polygon
        ? selectorMessage(messages.polygon)
        : DrawPolygon,
    },
    {
      label: {
        id: "panel3",
        name: "Subir polígono",
        disabled: true,
      },
    },
  ];

  const onChange = (level, tabId) => {
    if (tabId === "draw-polygon") {
      handlers.areaListChange();
      handlers.polygonChange();
    } else {
      handlers.areaListChange();
    }
  };

  return (
    <div className="selector">
      <div className="description">{description}</div>
      <Accordion
        componentsArray={sections}
        classNameDefault="m0b"
        classNameSelected="m0b selector-expanded"
        level="1"
        handleChange={onChange}
      />
    </div>
  );
};

Selector.propTypes = {
  areasData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      data: PropTypes.array,
    })
  ).isRequired,
  handlers: PropTypes.shape({
    areaListChange: PropTypes.func.isRequired,
    areaTypeChange: PropTypes.func.isRequired,
    geofenceChange: PropTypes.func.isRequired,
    polygonChange: PropTypes.func.isRequired,
  }).isRequired,
  description: PropTypes.object,
  connError: PropTypes.bool,
};

Selector.defaultProps = {
  description: {},
  connError: false,
};

export default Selector;
