import PropTypes from 'prop-types';
import React from 'react';

import styled from 'styled-components';

const Gradient = styled.div`
  height: 12px;
  width: 95%;
  margin: 0 auto;
  background: linear-gradient(0.25turn, ${({ fromColor }) => fromColor}, ${({ toColor }) => toColor});
`;

const GradientLegend = (props) => {
  const {
    from,
    to,
    fromColor,
    toColor,
  } = props;
  return (
    <div className="gradientLegend">
      <Gradient fromColor={fromColor} toColor={toColor} />
      <div className="text">
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </div>
  );
};

GradientLegend.propTypes = {
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  fromColor: PropTypes.string.isRequired,
  toColor: PropTypes.string.isRequired,
};

export default GradientLegend;
