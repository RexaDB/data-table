import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();
// React only flushes act() updates when it knows it runs under a test.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

import { afterEach, describe, expect, test } from "bun:test";
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

const { DataTable, DataTableProvider, InfiniteDataTable } = await import("../src");

interface Person {
  id: number;
  name: string;
  age: number;
}

const people: Person[] = [
  { id: 1, name: "Cara", age: 41 },
  { id: 2, name: "Abe", age: 29 },
  { id: 3, name: "Bea", age: 35 },
];

const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "age", header: "Age", sortable: true, align: "right" as const },
];

let root: Root | null = null;
let host: HTMLDivElement | null = null;

async function render(node: ReactNode) {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(async () => root!.render(node));
  return host;
}

afterEach(async () => {
  await act(async () => root?.unmount());
  host?.remove();
  root = null;
  host = null;
});

function bodyNames(el: HTMLElement) {
  return [...el.querySelectorAll("tbody tr")]
    .map((tr) => tr.querySelector("td")?.textContent ?? "")
    .filter(Boolean);
}

describe("DataTable", () => {
  test("renders headers and rows", async () => {
    const el = await render(<DataTable columns={columns} data={people} />);
    const headers = [...el.querySelectorAll("thead th")].map((th) => th.textContent);
    expect(headers).toContain("Name");
    expect(headers).toContain("Age");
    expect(bodyNames(el)).toEqual(["Cara", "Abe", "Bea"]);
  });

  test("sorts ascending, descending, then off", async () => {
    const el = await render(<DataTable columns={columns} data={people} />);
    const nameButton = el.querySelector("thead button") as HTMLButtonElement;
    await act(async () => nameButton.click());
    expect(bodyNames(el)).toEqual(["Abe", "Bea", "Cara"]);
    await act(async () => nameButton.click());
    expect(bodyNames(el)).toEqual(["Cara", "Bea", "Abe"]);
    await act(async () => nameButton.click());
    expect(bodyNames(el)).toEqual(["Cara", "Abe", "Bea"]);
  });

  test("reports selection through the checkbox column", async () => {
    let selected: string[] = [];
    const el = await render(
      <DataTable
        columns={columns}
        data={people}
        getRowId={(row) => String(row.id)}
        onSelectionChange={(ids) => {
          selected = ids;
        }}
        selectable
      />
    );
    const selectAll = el.querySelector('thead [role="checkbox"]') as HTMLElement;
    await act(async () => selectAll.click());
    expect(selected.sort()).toEqual(["1", "2", "3"]);
  });

  test("pages rows on the client", async () => {
    const el = await render(
      <DataTable
        columns={columns}
        data={people}
        pagination={{ page: 2, pageSize: 2, onPageChange: () => {} }}
      />
    );
    expect(bodyNames(el)).toEqual(["Bea"]);
    expect(el.textContent).toContain("Page 2 of 2");
  });

  test("shows the empty state", async () => {
    const el = await render(<DataTable columns={columns} data={[]} emptyState="Nothing here" />);
    expect(el.textContent).toContain("Nothing here");
  });

  test("uses components from DataTableProvider", async () => {
    function MyCheckbox(props: { "aria-label"?: string }) {
      return <input aria-label={props["aria-label"]} data-custom type="checkbox" />;
    }
    const el = await render(
      <DataTableProvider components={{ Checkbox: MyCheckbox }}>
        <DataTable columns={columns} data={people} selectable />
      </DataTableProvider>
    );
    expect(el.querySelectorAll("[data-custom]")).toHaveLength(people.length + 1);
  });

  test("translates labels", async () => {
    const el = await render(
      <DataTable columns={columns} data={[]} labels={{ noData: "Keine Daten" }} />
    );
    expect(el.textContent).toContain("Keine Daten");
  });

  test("renders every feature without React warnings", async () => {
    const original = console.error;
    const errors: unknown[][] = [];
    console.error = (...args: unknown[]) => {
      errors.push(args);
    };
    try {
      const el = await render(
        <DataTable
          columns={[
            { key: "name", header: "Name", sortable: true, hint: "Full name" },
            { key: "age", header: "Age", width: "6rem", collapsePriority: 1 },
          ]}
          data={people}
          loading
          onRowClick={() => {}}
          pagination={{ page: 1, pageSize: 2, onPageChange: () => {}, mode: "client" }}
          renderRowContextMenu={() => <span>menu</span>}
          resizable
          selectable
        />
      );
      expect(el.querySelectorAll('button[aria-label^="Resize"]')).toHaveLength(2);
    } finally {
      console.error = original;
    }
    expect(errors).toEqual([]);
  });

  test("renders an infinite table", async () => {
    const el = await render(
      <InfiniteDataTable columns={columns} data={people} onEndReached={undefined} />
    );
    expect(el.querySelector('[data-slot="data-table"]')).not.toBeNull();
  });
});

describe("DataGrid", () => {
  test("shows the load error with a retry action", async () => {
    const { DataGrid } = await import("../src/grid");
    let retried = false;
    const noop = () => {};
    const el = await render(
      <DataGrid
        error="connection refused"
        fetchingStructure={false}
        getChangedValue={noop}
        getRowId={() => null}
        handleAddColumn={async () => {}}
        handleFKPreview={noop}
        handleFKSelection={async () => false}
        handleUpdateRow={async () => {}}
        hasChanges={() => false}
        isAddColumnSheetOpen={false}
        isAddingColumn={false}
        loading={false}
        onCopyRowCSV={noop}
        onCopyRowJSON={noop}
        onDuplicateRow={noop}
        onPageChange={noop}
        onPageSizeChange={noop}
        onRetry={() => {
          retried = true;
        }}
        page={0}
        pageSize={50}
        pendingChanges={{}}
        results={null}
        selectedCell={null}
        selectedColumn={null}
        selectedRows={new Set()}
        selectedTable={null}
        setColumnToDelete={noop}
        setEditingCell={noop}
        setIsAddColumnSheetOpen={noop}
        setPendingChanges={noop}
        setSelectedCell={noop}
        setSelectedColumn={noop}
        setSelectedRows={noop}
        setSortConfig={noop}
        sortConfig={null}
        tableStructure={[]}
        toggleAllSelection={noop}
        toggleRowSelection={noop}
        totalCount={null}
        columnToDelete={null}
        editingCell={null}
      />
    );
    expect(el.textContent).toContain("Failed to load data");
    expect(el.textContent).toContain("connection refused");
    const retry = [...el.querySelectorAll("button")].find((b) => b.textContent === "Retry");
    await act(async () => retry?.click());
    expect(retried).toBe(true);
  });
});
