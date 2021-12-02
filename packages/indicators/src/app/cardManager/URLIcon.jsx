import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@material-ui/core';

const URLIcon = ({ color, fontSize }) => (
  <SvgIcon width="29" height="29" viewBox="0 0 21.97 21.97" style={{ color, fontSize }}>
    <path
      className="cls-link"
      d="M31.33,32.58a.5.5,0,0,1,0,.71L28.9,35.72a3,3,0,0,1-4.23,0,3,3,0,0,1,0-4.22l2.44-2.43a3,3,0,0,1,4.22,0,2.83,2.83,0,0,1,.66,1,.51.51,0,0,1-.28.66.5.5,0,0,1-.65-.28,2,2,0,0,0-.44-.66,2,2,0,0,0-2.8,0l-2.44,2.44A2,2,0,0,0,28.19,35l2.43-2.44A.51.51,0,0,1,31.33,32.58Zm1.05-7.84-2.44,2.43a.51.51,0,0,0,0,.71.5.5,0,0,0,.71,0l2.44-2.43a2,2,0,0,1,2.8,2.81l-2.43,2.43a2,2,0,0,1-2.81,0,1.93,1.93,0,0,1-.43-.66.5.5,0,0,0-.93.38,3.09,3.09,0,0,0,.65,1,3,3,0,0,0,4.23,0L36.6,29a3,3,0,0,0-4.22-4.22Zm9.24,5.49a11,11,0,1,1-11-11A11,11,0,0,1,41.62,30.23Zm-1,0a10,10,0,1,0-10,10A10,10,0,0,0,40.62,30.23Z"
      transform="translate(-19.65 -19.25)"
    />
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
