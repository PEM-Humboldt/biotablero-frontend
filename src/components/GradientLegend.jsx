import PropTypes from 'prop-types';
import React from 'react';

import styled from 'styled-components';

const Gradient = styled.div`
  height: 12px;
  width: 95%;
  margin: 0 auto;
  background: linear-gradient(
    0.25turn,
    ${({ colors }) => colors.join() }
  );
`;

const GradientLegend = (props) => {
  const {
    fromValue,
    toValue,
    colors,
  } = props;
  return (
    <div className="gradientLegend">
      <Gradient colors={colors} />
      <div className="text">
        <span>{fromValue}</span>
        <span>{toValue}</span>
      </div>
    </div>
  );
};

GradientLegend.propTypes = {
  fromValue: PropTypes.string.isRequired,
  toValue: PropTypes.string.isRequired,
  colors: PropTypes.array.isRequired,
};

export default GradientLegend;
