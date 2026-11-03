import { renderToString } from "react-dom/server";

import { DataTable } from "../src";
import { DataGrid } from "../src/grid";

if (typeof window !== "undefined") throw new Error("expected a server environment");
void DataGrid; // the grid entry must import cleanly on the server too

process.stdout.write(
  renderToString(
    <DataTable
      columns={[{ key: "name", header: "Name", sortable: true }]}
      data={[{ name: "Ada" }]}
      pagination={{ page: 1, pageSize: 10, onPageChange: () => {} }}
      selectable
    />
  )
);
