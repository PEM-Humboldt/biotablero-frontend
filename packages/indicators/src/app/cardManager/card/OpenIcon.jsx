import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@material-ui/core';

const OpenIcon = ({ color, fontSize }) => (
  <SvgIcon style={{ color, fontSize }} width="17.08" height="17.08" viewBox="0 0 17.08 17.08">
    <g id="Group_8" data-name="Group 8" transform="translate(-743.9 -320.9)">
      <line
        id="Line_2"
        data-name="Line 2"
        x2="15.88"
        transform="translate(744.5 329.5)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.2"
      />
      <line
        id="Line_3"
        data-name="Line 3"
        x2="15.88"
        transform="translate(752.5 321.5) rotate(90)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </g>
  </SvgIcon>
);

OpenIcon.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.number,
};

OpenIcon.defaultProps = {
  color: '',
  fontSize: 19,
};

export default OpenIcon;
