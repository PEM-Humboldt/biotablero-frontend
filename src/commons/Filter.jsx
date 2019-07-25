/** eslint verified */
import PropTypes from 'prop-types';

const doFilter = (item, filter) => {
  let { value } = filter;

  if (!(value instanceof RegExp)) {
    value = new RegExp(value, 'i');
  }
  return value.test(item[filter.property]);
};

const Filter = ({
  ...data
}) => (
  item => data.every(filter => doFilter(item, filter))
);

Filter.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Filter;
