import { describe, expect, test } from "bun:test";

import {
  getTableViewportLayout,
  pageRows,
  pinRowsFirst,
  resolveColumnWidths,
  tableLoadingOverlay,
  tableMinWidthCss,
} from "../src/table/lib/data-table";
import { parseCssColor } from "../src/grid/lib/css-color";
import { applyColumnDecorator } from "../src/grid/lib/decorators";
import { findStudioForeignKey } from "../src/grid/lib/foreign-keys";
import { canAdvanceFastPage, shouldLoadTableBatch } from "../src/grid/lib/paging";

const rows = [1, 2, 3, 4, 5].map((n) => ({ row: { n }, id: String(n) }));

describe("table layout", () => {
  test("pages rows and leaves them whole without a page size", () => {
    expect(pageRows(rows, 2, 2).map((r) => r.id)).toEqual(["3", "4"]);
    expect(pageRows(rows, 1)).toHaveLength(5);
  });

  test("pins matching rows first in order", () => {
    const pinned = pinRowsFirst(rows, (row) => row.n % 2 === 0);
    expect(pinned.map((r) => r.id)).toEqual(["2", "4", "1", "3", "5"]);
  });

  test("splits fr widths around fixed ones", () => {
    const widths = resolveColumnWidths([
      { key: "a", header: "A", width: "1fr" },
      { key: "b", header: "B", width: "100px" },
      { key: "c", header: "C", width: "3fr" },
    ]);
    expect(widths).toEqual([
      "calc((100% - 100px) * 1 / 4)",
      "100px",
      "calc((100% - 100px) * 3 / 4)",
    ]);
  });

  test("floors the table at its header widths", () => {
    expect(tableMinWidthCss([{ header: "Name" }], 64)).toBe(
      "max(64px, calc(5ch + 32px))"
    );
  });

  test("ends a fixed viewport on a whole row", () => {
    const layout = getTableViewportLayout({
      rowCount: 100,
      rowHeight: 48,
      rowSizing: "fixed",
      height: 440,
      horizontalScrollbarHeight: 0,
    });
    expect(layout.bodyHeight).toBe(384);
    expect(layout.scrolls).toBe(true);
  });

  test("chooses dimmed, load-more or skeleton loading", () => {
    expect(tableLoadingOverlay(true, 3, undefined, false).loadingState).toBe("dimmed");
    expect(tableLoadingOverlay(true, 3, undefined, true).loadingState).toBe("more");
    expect(tableLoadingOverlay(true, 0, undefined, false).loadingState).toBe("skeleton");
    expect(tableLoadingOverlay(false, 3, undefined, false).loadingState).toBeUndefined();
  });
});

describe("grid helpers", () => {
  test("loads the next batch only near the end", () => {
    const base = { rowCount: 100, loading: false, hasMore: true, error: null };
    expect(shouldLoadTableBatch({ ...base, visibleEnd: 50 })).toBe(false);
    expect(shouldLoadTableBatch({ ...base, visibleEnd: 85 })).toBe(true);
    expect(shouldLoadTableBatch({ ...base, visibleEnd: 85, error: "x" })).toBe(false);
  });

  test("advances fast pages by full pages or the known total", () => {
    expect(canAdvanceFastPage(0, 50, 50, null)).toBe(true);
    expect(canAdvanceFastPage(0, 50, 20, null)).toBe(false);
    expect(canAdvanceFastPage(1, 50, 50, 100)).toBe(false);
  });

  test("decorates display values and masks", () => {
    expect(applyColumnDecorator("4242424242", { kind: "mask", visibleChars: 4 })).toEqual({
      display: "••••••4242",
      masked: true,
    });
    expect(applyColumnDecorator(null, { kind: "truncate", maxLength: 3 }).display).toBe("NULL");
  });

  test("normalizes referenced_* foreign keys", () => {
    const fk = findStudioForeignKey(
      [{ column_name: "user_id", referenced_table: "users", referenced_column: "id" }],
      "user_id"
    );
    expect(fk).toEqual({
      column_name: "user_id",
      foreign_table_schema: "public",
      foreign_table_name: "users",
      foreign_column_name: "id",
    });
  });

  test("normalizes CSS colors to hex", () => {
    expect(parseCssColor("#abc")).toBe("#aabbcc");
    expect(parseCssColor("rgb(255, 0, 16)")).toBe("#ff0010");
    expect(parseCssColor("rgba(0, 0, 0, 0.5)")).toBe("#00000080");
  });
});
