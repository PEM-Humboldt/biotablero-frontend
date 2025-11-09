import type { HasId, ODataColumn } from "@appTypes/odata";

/**
 * Creates a reusable OData table component with typed columns and dynamic rows.
 * Each table instance renders a header and body based on the provided column definitions.
 *
 * @template T - Data type for each table row. Must include an `id` property.
 *
 * @param {ODataColumn<T>[]} cols - Array of column definitions, including name, source, type, and optional value processors or actions.
 * @returns {(props: { values: T[] }) => JSX.Element} A React component that renders a table for the given data.
 *
 * @remarks
 * - Columns of type `"action"` render custom React components defined in the column’s `actions` field.
 * - Columns of type `"text"` can optionally use `processValue` to format displayed values.
 * - Non-primitive values are stringified automatically.
 */
export function ODataTableFactory<T extends HasId>(cols: ODataColumn<T>[]) {
  function Table({ values }: { values: T[] }) {
    return (
      <table style={{ margin: "0 auto !importan" }}>
        <OdataTableHead cols={cols} />
        <tbody>
          {values.map((row) => (
            <ODataTableRow key={row.id} cols={cols} row={row} />
          ))}
        </tbody>
      </table>
    );
  }

  return Table;
}

function OdataTableHead<T extends HasId>({ cols }: { cols: ODataColumn<T>[] }) {
  return (
    <thead>
      <tr>
        {cols.map((col, i) => (
          <th scope="col" key={`i${col.name}_${i}`}>
            {col.name}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function ODataTableRow<T extends HasId>({
  cols,
  row,
}: {
  cols: ODataColumn<T>[];
  row: T;
}) {
  const logDataString = (col: ODataColumn<T>, row: T) => {
    const value = row[col.source];

    if (col.type === "action") {
      const Actions = col.actions;
      return <Actions value={value} />;
    }

    if (col.type === "text" && col.processValue) {
      return col.processValue(value);
    }

    return typeof value === "object" ? JSON.stringify(value) : String(value);
  };

  return (
    <tr>
      {cols.map((col, i) => (
        <td key={`${row.id}_${i}`}>{logDataString(col, row)}</td>
      ))}
    </tr>
  );
}
