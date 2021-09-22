import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@material-ui/core';

const URLIcon = ({ color, fontSize }) => (
  <SvgIcon width="17.921" height="16.76" viewBox="0 0 17.921 16.76" style={{ color, fontSize }}>
    <g id="Group_3" data-name="Group 3" transform="translate(-740.4 -138.163)">
      <path
        id="Path_3"
        data-name="Path 3"
        d="M14.517,40.623,11.34,43.8a3.254,3.254,0,0,1-4.589,0h0a3.254,3.254,0,0,1,0-4.589l3.177-3.177a3.254,3.254,0,0,1,4.589,0h0a3.215,3.215,0,0,1,.71,1.072"
        transform="translate(735.196 109.576)"
        fill="none"
        stroke="#e84a60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <path
        id="Path_4"
        data-name="Path 4"
        d="M36.551,15.364l3.177-3.177a3.255,3.255,0,0,1,4.589,0h0a3.255,3.255,0,0,1,0,4.589L41.14,19.954a3.254,3.254,0,0,1-4.589,0h0a3.22,3.22,0,0,1-.71-1.072"
        transform="translate(712.221 127.759)"
        fill="none"
        stroke="#e84a60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </g>
  </SvgIcon>
);

URLIcon.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.number,
};

URLIcon.defaultProps = {
  color: '',
  fontSize: 19,
};

export default URLIcon;
