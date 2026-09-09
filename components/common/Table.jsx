export default function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col || ""}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
