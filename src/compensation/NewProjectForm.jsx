/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';

import Autocomplete from '../Autocomplete';

const NewProjectForm = ({
  regions, status, handlers,
  // headers, rows, footers, classTable, remarkedElement,
}) => (
  <div className="paperModal">
    <Autocomplete // TODO: Pensar como PopMenu o Selector
      valueSelected={value => handlers('region', value)}
      label="Seleccione la región del proyecto:"
      name="Regiones"
      data={regions}
      // key={`${type}-${label}`}
    />
    <Autocomplete // TODO: Pensar como PopMenu o Selector
      valueSelected={value => handlers('status', value)}
      label="Seleccione el estado del proyecto:"
      name="Estados"
      data={status}
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
  handlers: PropTypes.func.isRequired,
};

export default NewProjectForm;
