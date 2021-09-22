import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@material-ui/core';

const DownloadIcon = ({ color, fontSize }) => (
  <SvgIcon style={{ color, fontSize }} width="23.507" height="25.751" viewBox="0 0 23.507 25.751">
    <path
      id="Path_25"
      data-name="Path 25"
      d="M4292.28-660.435h-5.152a.8.8,0,0,0-.8.8.8.8,0,0,0,.8.8h5.152c.275,0,.514.126.514.4v12.87a.641.641,0,0,1-.55.633h-19.235a.617.617,0,0,1-.521-.633v-12.87c0-.275.209-.4.484-.4h4.753a.8.8,0,0,0,.8-.8.8.8,0,0,0-.8-.8h-4.753a2.008,2.008,0,0,0-2.085,2v12.87a2.212,2.212,0,0,0,2.122,2.234h19.235a2.236,2.236,0,0,0,2.15-2.234v-12.87A2.033,2.033,0,0,0,4292.28-660.435Zm-15.951,5.341a.8.8,0,0,0,.158,1.121l4.994,3.764.017.012a1.932,1.932,0,0,0,1.123.359,1.93,1.93,0,0,0,1.121-.358l5.023-3.777a.8.8,0,0,0,.159-1.121.819.819,0,0,0-1.136-.159l-4.4,3.294v-16.327a.8.8,0,0,0-.8-.8.8.8,0,0,0-.8.8v16.334l-4.36-3.3A.777.777,0,0,0,4276.329-655.094Z"
      transform="translate(-4270.887 669.081)"
      fill="#e84a5f"
    />
  </SvgIcon>
);

DownloadIcon.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.number,
};

DownloadIcon.defaultProps = {
  color: '',
  fontSize: 24,
};

export default DownloadIcon;
