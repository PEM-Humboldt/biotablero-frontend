import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@material-ui/core';

const URLIcon = ({ color, fontSize }) => (
  <SvgIcon viewBox="-5 -5 80 80" style={{ color, fontSize }}>
    <path d="M14.851 11.923a4 4 0 00-6.682-1.749l-4.998 4.998a4 4 0 105.656 5.657l3.842-3.841.333.009c.404 0 .802-.04 1.189-.117l-4.657 4.656A4.981 4.981 0 015.999 23a5.001 5.001 0 01-3.535-8.535l4.998-4.998a4.983 4.983 0 013.536-1.464c1.279 0 2.56.488 3.535 1.464a4.978 4.978 0 011.105 1.672l-.787.784zm-5.703.147a4 4 0 006.682 1.756l4.999-4.998a3.999 3.999 0 000-5.657 4 4 0 00-5.657 0l-3.841 3.841-.333-.009c-.404 0-.802.04-1.189.117l4.656-4.656A4.983 4.983 0 0118.001 1c1.279 0 2.56.488 3.535 1.464a5.003 5.003 0 010 7.071l-4.999 4.998a4.981 4.981 0 01-3.535 1.464c-1.28 0-2.56-.488-3.535-1.464a4.992 4.992 0 01-1.107-1.678l.788-.785z" />
  </SvgIcon>
);

URLIcon.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.number,
};

URLIcon.defaultProps = {
  color: '',
  fontSize: 24,
};

export default URLIcon;
