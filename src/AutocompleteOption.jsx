/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';

const AutocompleteOption = ({
  option, onSelect, children, isFocused, isSelected, onFocus,
}) => (
  <MenuItem
    onFocus={onFocus}
    selected={isFocused}
    onClick={event => onSelect(option, event)}
    component="div"
    style={{
      fontWeight: isSelected ? 500 : 400,
    }}
  >
    {children}
  </MenuItem>
);

AutocompleteOption.propTypes = {
  option: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  isFocused: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onFocus: PropTypes.func.isRequired,
};

export default AutocompleteOption;
