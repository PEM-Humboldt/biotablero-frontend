/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';

const Filter = ({
  data,
}) => (
  <div>
    {data}
  </div>
);

Filter.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Filter;
