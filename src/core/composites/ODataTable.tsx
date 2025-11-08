import type { HasId, ODataColumn } from "@appTypes/odata";

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
