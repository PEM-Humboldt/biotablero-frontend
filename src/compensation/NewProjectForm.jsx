/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';

import Autocomplete from '../Autocomplete';

const NewProjectForm = ({
  regions, status,
  // headers, rows, footers, classTable, remarkedElement,
}) => (
  <div className="paperModal">
    Hola
    <Autocomplete // TODO: Pensar como PopMenu o Selector
      // valueSelected={value => handlers[2](parent, value)}
      name="Regiones"
      data={regions}
      // key={`${type}-${label}`}
    />
    {
      status.length
    }
  </div>
);

NewProjectForm.propTypes = {
  regions: PropTypes.array.isRequired,
  status: PropTypes.array.isRequired,
};

export default NewProjectForm;
