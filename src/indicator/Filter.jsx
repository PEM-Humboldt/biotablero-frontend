/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';

const Filter = ({
  filterClass, name, tooltipTitle, linkText,
}) => (
  <div
    className={filterClass}
    id={name}
    data-filter-value={`.${name}`}
    data-tooltip
    title={`.${tooltipTitle}`}
  >
    <label
      className="metas"
      htmlFor={name}
    >
      <input type="text" id={name} />
      {linkText}
    </label>
  </div>
);

Filter.propTypes = {
  filterClass: PropTypes.string,
  name: PropTypes.string,
  tooltipTitle: PropTypes.string,
  linkText: PropTypes.string,
};

Filter.defaultProps = {
  filterClass: '',
  name: '',
  tooltipTitle: '',
  linkText: '',
};

export default Filter;
