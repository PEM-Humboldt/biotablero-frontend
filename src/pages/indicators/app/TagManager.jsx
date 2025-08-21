import React, { useEffect, useReducer } from "react";
import PropTypes from "prop-types";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DotIcon from "@material-ui/icons/FiberManualRecord";
import CloseIcon from "pages/indicators/components/CloseIcon";

const boxColors = [
  "#b1babc",
  "#b1b2b7",
  "#666a72",
  "#b8bfcf",
  "#8792af",
  "#697f9f",
  "#5a6e7e",
  "#b8bcaf",
  "#7b8780",
  "#988b7d",
];

const TagManager = (props) => {
  const { data, filterData } = props;
  const [selected, updateSelected] = useReducer((state, { action, value }) => {
    if (action === "clear") {
      return [];
    }
    if (state.some((stateVal) => stateVal[0] === value[0])) {
      return state.filter((e) => e[0] !== value[0]);
    }
    return state.concat([value]);
  }, []);

  useEffect(() => {
    filterData(selected.map((pair) => pair[0]));
  }, [selected]);

  return (
    <>
      <div className="tagList">
        <div className="tagCount">
          {selected.length > 0 && (
            <h4>
              <button
                className="clearFilters"
                title="Limpiar filtros"
                type="button"
                onClick={() => updateSelected({ action: "clear" })}
              >
                <CloseIcon />
              </button>
              {`${selected.length} filtro${selected.length > 1 ? "s" : ""}`}
            </h4>
          )}
        </div>
        {Array.from(data).map(([title, list], idx) => (
          <Accordion className="tagBox" key={title}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id={title}
              className="tagCat"
              style={{ backgroundColor: boxColors[idx] }}
            >
              <div>{title}</div>
              {selected.some((stateVal) => stateVal[1] === boxColors[idx]) && (
                <div>
                  <DotIcon fontSize="inherit" />
                </div>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <div className="tagOptions">
                {list.map((tag) => (
                  <div key={tag}>
                    <input
                      type="checkbox"
                      value={tag}
                      checked={selected.some((stateVal) => stateVal[0] === tag)}
                      onChange={() =>
                        updateSelected({
                          action: "click",
                          value: [tag, boxColors[idx]],
                        })
                      }
                    />
                    {tag}
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
      <div className="selectedTags">
        {selected.map(([tag, color]) => (
          <div key={`${tag}-selected`} style={{ backgroundColor: color }}>
            {tag}
          </div>
        ))}
      </div>
    </>
  );
};

TagManager.propTypes = {
  data: PropTypes.instanceOf(Map),
  filterData: PropTypes.func,
};

TagManager.defaultProps = {
  data: [],
  filterData: () => {},
};
export default TagManager;
