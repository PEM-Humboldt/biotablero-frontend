import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@mui/material';

const PlusIcon = ({ color, fontSize }) => (
  <SvgIcon style={{ color, fontSize }} width="17.08" height="17.08" viewBox="0 0 21.97 21.97">
    <path
      className="cls-add"
      d="M30,41A11,11,0,1,1,41,30,11,11,0,0,1,30,41Zm0-21A10,10,0,1,0,40,30,10,10,0,0,0,30,20Zm5.62,9.24H30.75V24.38a.75.75,0,1,0-1.5,0v4.87H24.38a.75.75,0,1,0,0,1.5h4.87v4.87a.75.75,0,1,0,1.5,0V30.75h4.87a.75.75,0,1,0,0-1.5Z"
      transform="translate(-19.01 -19.01)"
    />
  </SvgIcon>
);

PlusIcon.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.number,
};

PlusIcon.defaultProps = {
  color: '',
  fontSize: 19,
};

export default PlusIcon;
