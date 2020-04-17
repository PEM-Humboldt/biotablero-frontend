import React from 'react';
import PropTypes from 'prop-types';

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const TotalArea = ({ value }) => (
  <h4>
    hectáreas totales
    <b>{`${numberWithCommas(value)} ha`}</b>
  </h4>
);

TotalArea.propTypes = {
  value: PropTypes.string.isRequired,
};

export default TotalArea;
