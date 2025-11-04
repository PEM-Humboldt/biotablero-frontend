type HasId = {
  id: string;
};

type ODataColumn<T> = {
  name: string;
  source: keyof T;
} & (
  | {
      type: "text";
      sortBy?: boolean;
      processValue?: (value: T[keyof T]) => string;
    }
  | {
      type: "action";
      label: string;
      action: (value: T[keyof T]) => void;
    }
);

function ODataTableRow<T extends HasId>({
  cols,
  row,
}: {
  cols: ODataColumn<T>[];
  row: T;
}) {
  const logDataString = (col: ODataColumn<T>, row: T) => {
    const value = row[col.source];

    if (col.type === "action" && col.action) {
      return <button onClick={() => col.action(value)}>{col.label}</button>;
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

function OdataTableHead<T extends HasId>({
  cols,
  sortCallback,
}: {
  cols: ODataColumn<T>[];
  sortCallback: (by: string) => void;
}) {
  return (
    <thead>
      <tr>
        {cols.map((col, i) => (
          <th scope="col" key={`i${col.name}_${i}`}>
            {col.type === "text" && col?.sortBy === undefined ? (
              col.name
            ) : (
              <button onClick={() => sortCallback(col.source as string)}>
                {col.name}
              </button>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function ODataTable<T extends HasId>(cols: ODataColumn<T>[]) {
  function Table({
    values,
    sortCallback,
  }: {
    values: T[];
    sortCallback: (by: string) => void;
  }) {
    return (
      <table>
        <OdataTableHead cols={cols} sortCallback={sortCallback} />
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
