import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@material-ui/core';

const CloseIcon = ({ color, fontSize }) => (
  <SvgIcon style={{ color, fontSize }} width="29" height="29" viewBox="0 0 29 29">
    <g id="Ellipse_5" data-name="Ellipse 5" fill="none" stroke="#fff" strokeWidth="2">
      <circle cx="14.5" cy="14.5" r="14.5" stroke="none" />
      <circle cx="14.5" cy="14.5" r="13.5" fill="none" />
    </g>
    <line
      id="Line_1"
      data-name="Line 1"
      x1="12"
      transform="translate(8.5 14.5)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="2"
    />
  </SvgIcon>
);

CloseIcon.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.number,
};

CloseIcon.defaultProps = {
  color: '#fff',
  fontSize: 24,
};

export default CloseIcon;
