import React from 'react';
import CsvDownload from 'react-json-to-csv';
import SearchContext from 'pages/search/SearchContext';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/GetApp';

class DownloadCSV extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          buttonlabel: 'Descargar Datos',
      };
    }

    render() {
        const { buttonlabel } = this.state;
        const { data, filename } = this.props;
        return (
          <div className="icondown-container">
            <CsvDownload
              data={data}
              title={buttonlabel}
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
      }
    }

DownloadCSV.propTypes = {
    data: PropTypes.array,
    filename: PropTypes.string,
  };
DownloadCSV.defaultProps = {
    data: {},
    filename: '',
  };
export default DownloadCSV;
DownloadCSV.contextType = SearchContext;
