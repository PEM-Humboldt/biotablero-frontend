import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DotIcon from '@material-ui/icons/FiberManualRecord';

const boxColors = [
  '#b1babc',
  '#b1b2b7',
  '#666a72',
  '#b8bfcf',
  '#8792af',
  '#697f9f',
  '#5a6e7e',
  '#b8bcaf',
  '#7b8780',
  '#988b7d',
];

const TagManager = (props) => {
  const { data, filterData } = props;
  const [selected, updateSelected] = useReducer((state, value) => {
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
                      onChange={() => updateSelected([tag, boxColors[idx]])}
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
