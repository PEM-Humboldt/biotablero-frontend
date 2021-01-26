/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    MuiPaper: {
      root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        backgroundColor: '#2a363b',
        padding: 10,
      },
    },
    MuiChip: {
      root: {
        borderRadius: 3,
        margin: 3,
      },
    },
  },
});

const ChipManager = ({
  filters,
}) => (
  <MuiThemeProvider theme={theme}>
    <Paper elevation={2}>
      {filters.map(filter => (
        <Chip
          clickable
          {...filter}
        />
      ))}
    </Paper>
  </MuiThemeProvider>
);

ChipManager.propTypes = {
  filters: PropTypes.array.isRequired,
};

export default ChipManager;
