import PropTypes from 'prop-types';
import React from 'react';

import DownloadIcon from '@mui/icons-material/GetApp';
import CsvDownload from 'react-json-to-csv';

const DownloadCSV = (props) => {
  const {
    data,
    filename,
    buttonTitle,
    className,
  } = props;
  return (
    <div className={`icondown-container ${className}`}>
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
        <DownloadIcon />
      </CsvDownload>
    </div>
  );
};

DownloadCSV.propTypes = {
  data: PropTypes.array,
  filename: PropTypes.string,
  buttonTitle: PropTypes.string,
  className: PropTypes.string,
};

DownloadCSV.defaultProps = {
  data: {},
  filename: '',
  buttonTitle: 'Descargar Datos',
  className: '',
};

export default DownloadCSV;
