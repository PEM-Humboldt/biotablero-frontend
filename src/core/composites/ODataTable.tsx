import type { HasId, ODataColumn } from "@appTypes/odata";

/**
 * Renders a data table based on OData column definitions and a dataset.
 *
 * @template T - Row data type. Must include an `id` property.
 *
 * @param props - The component props.
 * @param props.cols - An array of column definitions (`ODataColumn<T>[]`).
 * Columns can be:
 * - **Text columns (`type: "text"`)**: For string/formatted values.
 * Supports `sortBy` and `processValue` for transformations.
 * - **Action columns (`type: "action"`)**: For custom React elements.
 * Requires `label` and an `actions` render function.
 * @param props.values - The array of data records to be displayed in the rows.
 * @param props.className - Optional CSS classes for the table container.
 *
 * @returns A React component rendering a complete table with typed headers and rows.
 *
 * @remarks
 * - Non-primitive values (e.g., objects) are automatically stringified.
 * - Action columns allow embedding interactive components such as buttons or menus.
 */
export function ODataTable<T extends HasId>({
  cols,
  values,
  className,
}: {
  cols: ODataColumn<T>[];
  values: T[];
  className?: string;
}) {
  return (
    <div className={className}>
      <table>
        <OdataTableHead cols={cols} />
        <tbody>
          {values.map((row) => (
            <ODataTableRow key={row.id} cols={cols} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OdataTableHead<T extends HasId>({ cols }: { cols: ODataColumn<T>[] }) {
  return (
    <thead>
      <tr>
        {cols.map((col, i) => (
          <th scope="col" key={`i${col.name}_${i}`}>
            {col.type === "action" ? (
              <span className="sr-only">{col.name}</span>
            ) : (
              col.name
            )}
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
