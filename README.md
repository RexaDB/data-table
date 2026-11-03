# @rexadb/data-table

React tables for database apps, extracted from [RexaDB](https://github.com/RexaDB/RexaDB).

- **`DataTable`**: a list table with sorting, row selection, column resizing, columns that collapse on narrow screens, client/server/cursor paging, virtualized scrolling, infinite loading, skeletons, row context menus and translatable labels.
- **`DataGrid`** (`@rexadb/data-table/grid`): a canvas grid for browsing and editing database rows, built on [Glide Data Grid](https://grid.glideapps.com). It has typed cells (JSON, enum, boolean, date) with inline editors, pending-change and pending-delete marks, foreign-key previews, multi-cell selection and copy, header sort and column menus, and paged or infinite footers.

It works with React 18 and 19, renders on the server (Next.js App Router included, every entry is `"use client"`), and ships ESM, CommonJS and TypeScript types.

## Install

```sh
npm install @rexadb/data-table
# for DataGrid only:
npm install @glideapps/glide-data-grid
```

## Styles

Choose one:

**Any app.** Import the precompiled stylesheet once:

```ts
import "@rexadb/data-table/styles.css";
```

**Tailwind CSS v4 apps.** Let Tailwind generate the classes alongside yours:

```css
@import "tailwindcss";
@import "@rexadb/data-table/theme.css";
```

`theme.css` registers the package with Tailwind (`@source`) and maps its color tokens. If your app already defines shadcn-style tokens, you can skip the import and add `@source "../node_modules/@rexadb/data-table/dist";` instead.

Dark mode follows a `.dark` class on `<html>`. Colors are CSS variables with zero-specificity defaults, so setting them on `:root` / `.dark` re-themes everything:

| Variable | Used for |
| --- | --- |
| `--background`, `--foreground`, `--muted`, `--muted-foreground`, `--border`, `--input`, `--ring`, `--primary`, `--primary-foreground`, `--popover`, `--popover-foreground`, `--accent`, `--destructive` | Shared UI |
| `--table-band`, `--table-row`, `--table-row-hover`, `--surface-lift` | `DataTable` shell, rows and shadow |
| `--studio-bg`, `--studio-border`, `--table-header-bg`, `--studio-cell-text`, `--studio-cell-muted`, `--studio-row-hover`, `--studio-accent-purple` | `DataGrid` canvas (use hex or `rgb()`) |

## DataTable

```tsx
import { DataTable, type TableColumn } from "@rexadb/data-table";

interface User {
  id: string;
  email: string;
  created: string;
}

const columns: TableColumn<User>[] = [
  { key: "email", header: "Email", sortable: true },
  { key: "created", header: "Created", sortable: true, width: "10rem", collapsePriority: 1 },
];

export function Users({ users }: { users: User[] }) {
  const [page, setPage] = useState(1);
  return (
    <DataTable
      columns={columns}
      data={users}
      getRowId={(user) => user.id}
      selectable
      resizable
      pagination={{ page, pageSize: 20, onPageChange: setPage }}
      onRowClick={(user) => console.log(user)}
    />
  );
}
```

Paging modes: client (default; the table slices `data`), `{ mode: "server", totalItems }` and `{ mode: "cursor", hasNextPage }`. For endless lists use `InfiniteDataTable` with `onEndReached` and `loadingMore`. `DataTableSkeleton` is a loading placeholder with the same frame. Pass `labels={{ noData: "Keine Daten", … }}` to translate every string.

## DataGrid

```tsx
import "@glideapps/glide-data-grid/dist/index.css"; // once, anywhere in your app
import { DataGrid } from "@rexadb/data-table/grid";

<DataGrid
  results={{ rows, fields }}            // rows plus [{ name }] in column order
  tableStructure={columns}              // [{ name, data_type, is_primary_key, is_foreign_key }]
  getRowId={(row) => String(row.id)}
  pendingChanges={changes}              // { [rowId]: { [column]: { old, new } } }
  setPendingChanges={setChanges}
  handleUpdateRow={async (rowId, column, oldValue, newValue) => { /* stage the edit */ }}
  sortConfig={sort}
  setSortConfig={setSort}
  page={page} pageSize={50} totalCount={total}
  onPageChange={setPage} onPageSizeChange={setPageSize}
  // …selection state, plus the optional integrations below
/>
```

The grid holds no data of its own. Your app owns rows, edits, selection and paging; the grid renders them and reports what the reader does. Anything that needs the database goes through optional props:

| Prop | Purpose |
| --- | --- |
| `fetchReferencedRecord(schema, table, keyValues)` | Foreign-key preview popover |
| `fetchForeignKeys(schema, table)` | Reload foreign keys missing from `foreignKeys` |
| `renderAddColumnSheet(ctx)` / `renderEditColumnSheet(ctx)` | Your column DDL forms |
| `handleDeleteColumn`, `setColumnToDelete` | "Delete column" with a confirm dialog |
| `onRetry`, `onRefresh` | Error and empty-state actions |
| `themeKey`, `colorScheme` | Repaint the canvas when your theme changes |

See `DataGridProps` in the type definitions for the full list.

RexaDB applies a small patch to `@glideapps/glide-data-grid@6.0.4-alpha24`. It stops grid lines and the frozen-column shadow from drawing past the last row, and keeps the trailing "Add column" column blank. Without the patch the grid works the same, but those lines show through. The patch is in RexaDB's `patches/` directory if you want the same look.

## Using your own components

The tables render buttons, selects, checkboxes, tooltips, popovers, a calendar, side sheets, a confirm dialog, a code editor and icons. Built-in versions (Radix-based) are included. To use your design system's versions, pass them to `DataTableProvider`. The shapes follow [shadcn/ui](https://ui.shadcn.com), so its components drop in unchanged:

```tsx
import { DataTableProvider } from "@rexadb/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import * as Select from "@/components/ui/select";
import { ArrowUpIcon } from "lucide-react";

<DataTableProvider
  components={{
    Button,
    Checkbox,
    Select: Select.Select,
    SelectTrigger: Select.SelectTrigger,
    SelectValue: Select.SelectValue,
    SelectContent: Select.SelectContent,
    SelectItem: Select.SelectItem,
    CodeEditor: MyMonacoJsonEditor,   // { value, onChange }
    icons: { ArrowUp: ArrowUpIcon },
  }}
>
  <App />
</DataTableProvider>
```

Anything you leave out keeps its built-in version, and nested providers layer on top of outer ones. If `renderRowContextMenu` returns menu items from your design system, also pass that system's `ContextMenu`, `ContextMenuTrigger` and `ContextMenuContent`. With the built-in menu, use the exported `ContextMenuItem` and `ContextMenuSeparator`.

## Development

```sh
bun install
bun run test        # unit, DOM (happy-dom) and server-render tests
bun run typecheck
bun run build       # dist/: ESM, CJS, types, styles.css, theme.css
```

## License

GPL-3.0-or-later, same as RexaDB.
