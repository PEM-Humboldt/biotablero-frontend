import React from 'react';
import PropTypes from 'prop-types';

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const GeneralArea = ({ value }) => (
  <h4>
    hectáreas totales
    <b>{`${numberWithCommas(Number(value).toFixed(2))} ha`}</b>
  </h4>
);

GeneralArea.propTypes = {
  value: PropTypes.string.isRequired,
};

export default GeneralArea;
