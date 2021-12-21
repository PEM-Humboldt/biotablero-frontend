import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@material-ui/core';

const CloseIcon = ({ color, fontSize }) => (
  <SvgIcon style={{ color, fontSize }} width="29" height="29" viewBox="0 0 21.96 21.96">
    <path
      className="cls-close"
      d="M37.77,22.23a11,11,0,1,0,0,15.54A11,11,0,0,0,37.77,22.23Zm-.71,14.83a10,10,0,1,1,0-14.12A10,10,0,0,1,37.06,37.06ZM34.51,26.55,31.06,30l3.45,3.45a.75.75,0,0,1,0,1.06.79.79,0,0,1-.53.22.75.75,0,0,1-.53-.22L30,31.06l-3.45,3.45a.75.75,0,0,1-.53.22.79.79,0,0,1-.53-.22.75.75,0,0,1,0-1.06L28.94,30l-3.45-3.45a.75.75,0,0,1,1.06-1.06L30,28.94l3.45-3.45a.75.75,0,1,1,1.06,1.06Z"
      transform="translate(-19.02 -19.02)"
    />
  </SvgIcon>
);

CloseIcon.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.number,
};

CloseIcon.defaultProps = {
  color: '#fff',
  fontSize: 20,
};

export default CloseIcon;
