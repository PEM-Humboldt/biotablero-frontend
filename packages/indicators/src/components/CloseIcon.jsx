import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@material-ui/core';

const CloseIcon = ({ color, fontSize }) => (
  <SvgIcon style={{ color, fontSize }} width="29" height="29" viewBox="0 0 29 29">
    <line
      id="Line_1"
      data-name="Line 1"
      x1="17"
      transform="translate(6 14.5)"
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
