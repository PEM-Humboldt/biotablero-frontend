import PropTypes from 'prop-types';
import React from 'react';

import DownloadIcon from '@material-ui/icons/GetApp';
import CsvDownload from 'react-json-to-csv';

const DownloadCSV = ({ data, filename, buttonTitle }) => (
  <div className="icondown-container">
    <CsvDownload
      data={data}
      title={buttonTitle}
      filename={filename}
      style={{
        cursor: 'pointer',
        textDecoration: 'none',
        background: 'none',
        border: 'none',
      }}
    >
      <DownloadIcon className="icondown" />
    </CsvDownload>
  </div>
);

DownloadCSV.propTypes = {
    data: PropTypes.array,
    filename: PropTypes.string,
    buttonTitle: PropTypes.string,
  };

DownloadCSV.defaultProps = {
    data: {},
    filename: '',
    buttonTitle: 'Descargar Datos',
  };

export default DownloadCSV;
