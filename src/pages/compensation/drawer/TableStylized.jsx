import PropTypes from "prop-types";
import React from "react";

const TableStylized = ({
  headers,
  rows,
  footers,
  classTable,
  remarkedElement,
  hide,
}) => (
  <div>
    <table
      className={`graphcard ${classTable}`}
      style={{ display: hide ? "none" : "inline-table" }}
    >
      <thead>
        <tr className="row1table">
          {headers.map((element, i) => (
            <th key={`header-${i}`}>{element}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr className="row2table" key={row.key}>
            {row.values.map((element, i) => (
              <td key={`row-${row.key}-${i}`}>
                {remarkedElement === element ? <b>{element}</b> : element}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="row3table">
          {footers.map((element, i) => (
            <td key={`footer-${i}`}>{element}</td>
          ))}
        </tr>
      </tfoot>
    </table>
  </div>
);

// headers, footers and rows.values must have the same length
TableStylized.propTypes = {
  headers: PropTypes.array.isRequired,
  // rows is an array of objects, where each object has a key and an array of values
  rows: PropTypes.array.isRequired,
  footers: PropTypes.array,
  classTable: PropTypes.string,
  remarkedElement: PropTypes.string,
  hide: PropTypes.bool,
};

TableStylized.defaultProps = {
  footers: [],
  classTable: "",
  remarkedElement: "",
  hide: false,
};

export default TableStylized;
