import DownloadIcon from "@mui/icons-material/GetApp";
import CsvDownload from "react-json-to-csv";

interface Props {
  data?: Array<unknown>;
  filename?: string;
  buttonTitle?: string;
  className?: string;
}

const DownloadCSV = (props: Props) => {
  const {
    data = {},
    filename = "",
    buttonTitle = "Descargar Datos",
    className = "",
  } = props;
  return (
    <div className={`icondown-container ${className}`}>
      <CsvDownload
        data={data}
        title={buttonTitle}
        filename={filename}
        style={{
          cursor: "pointer",
          textDecoration: "none",
          background: "none",
          border: "none",
        }}
      >
        <DownloadIcon />
      </CsvDownload>
    </div>
  );
};

export default DownloadCSV;
