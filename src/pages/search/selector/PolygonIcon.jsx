import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@mui/material';

const PolygonIcon = ({ color, fontSize }) => (
  <SvgIcon viewBox="76 18 24 24" style={{ color, fontSize }}>
    <path d="M100 24.6 97.9 39.4 83.1 42 76 28.8 86.5 18Z" />
  </SvgIcon>
);

PolygonIcon.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.number,
};

PolygonIcon.defaultProps = {
  color: '',
  fontSize: 24,
};

export default PolygonIcon;
