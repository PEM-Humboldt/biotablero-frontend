import type { HasId, ODataColumn } from "@appTypes/odata";

/**
 * Creates a reusable OData table component with typed columns and dynamic rows.
 * The generated component renders a header and body based on the provided column definitions.
 *
 * @template T - Row data type. Must include an `id` property.
 *
 * @param cols - Column definitions describing how each field of type `T` should be rendered.
 *   Each column has a `name` (display label) and a `source` (key from the row data).
 *   Columns can be one of two types:
 *   - **Text columns (`type: "text"`)**: display string or formatted values.
 *     Optional:
 *       - `sortBy` — indicates whether the column supports sorting.
 *       - `processValue` — function to transform or format the raw value before rendering.
 *   - **Action columns (`type: "action"`)**: render custom React components for each row.
 *     Required:
 *       - `label` — accessible label for the action.
 *       - `actions` — render function that receives `{ value }` and returns a `ReactNode`.
 *
 * @returns A React component that renders a table for the given dataset.
 *
 * @remarks
 * - Non-primitive values (e.g., objects) are automatically stringified.
 * - Action columns allow embedding interactive components such as buttons or menus.
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
