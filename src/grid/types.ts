import type React from "react";
import type { ColumnDecorator } from "./lib/decorators";
import type { StudioForeignKey } from "./lib/foreign-keys";
import type { GridColorScheme, GridThemeKey } from "./theme";

/** Result of looking up the row a foreign key points at. */
export interface ReferencedRecordResult {
  success: boolean;
  /** The referenced row, keyed by column name. */
  data?: Record<string, unknown> | null;
  /** Column descriptors, `{ name, dataTypeName? }`, in display order. */
  fields?: Array<{ name: string; dataTypeName?: string }>;
  error?: string;
}

/** Result of (re)loading a table's foreign keys. */
export interface ForeignKeysResult {
  success: boolean;
  /** Raw foreign-key rows; `referenced_*` and camelCase names are normalized. */
  data?: unknown;
}

/** Everything the grid knows when it asks the host to render a column sheet. */
export interface ColumnSheetContext {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schema: string | null | undefined;
  table: string;
}

/**
 * Props for the database row grid. Row data, edits and paging stay with the
 * host; the grid renders them, reports what the reader does, and asks the
 * host for anything that needs the database (foreign-key lookups, column
 * DDL) through the callbacks and render slots below.
 */
export interface DataGridProps {
  results: any;
  tableStructure: any[];
  customCellRenderer?: (args: {
    row: any;
    columnName: string;
    value: any;
    rowIndex: number;
  }) => React.ReactNode;
  globalSearchQuery?: string;
  pendingActions?: Array<{
    type: string;
    metadata: any;
  }>;
  selectedRows: Set<number>;
  setSelectedRows: (rows: Set<number>) => void;
  toggleAllSelection: () => void;
  toggleRowSelection: (index: number) => void;
  getRowId: (row: any, index: number) => string | null;
  pendingChanges: any;
  setPendingChanges: (changes: any) => void;
  editingCell: any;
  setEditingCell: (cell: any) => void;
  selectedCell: any;
  setSelectedCell: (cell: any) => void;
  selectedColumn: string | null;
  setSelectedColumn: (column: string | null) => void;
  hasChanges: (rowIndex: number, columnName: string) => boolean;
  getChangedValue: (rowIndex: number, columnName: string) => any;
  handleUpdateRow: (
    rowId: string,
    columnName: string,
    oldValue: any,
    newValue: any,
    columnType: string,
  ) => Promise<void>;
  handleFKSelection: (rowIndex: number, columnName: string) => Promise<boolean>;
  handleFKPreview: (columnName: string, value: any) => void;
  loading: boolean;
  fetchingStructure: boolean;
  error: string | null;
  isAddColumnSheetOpen: boolean;
  setIsAddColumnSheetOpen: (open: boolean) => void;
  isAddingColumn: boolean;
  handleAddColumn: (column: any) => Promise<void>;
  handleDeleteColumn?: (columnName: string) => Promise<void>;
  /** Shows "Edit column" in the header menu. The sheet itself comes from `renderEditColumnSheet`. */
  handleEditColumn?: (payload: any) => Promise<void>;
  columnToDelete: string | null;
  setColumnToDelete: (column: string | null) => void;
  columnToEdit?: string | null;
  setColumnToEdit?: (column: string | null) => void;
  isEditColumnSheetOpen?: boolean;
  setIsEditColumnSheetOpen?: (open: boolean) => void;
  isEditingColumn?: boolean;
  selectedTable: string | null;
  selectedSchema?: string | null;
  sortConfig: { column: string; direction: "ASC" | "DESC" } | null;
  setSortConfig: (
    config: { column: string; direction: "ASC" | "DESC" } | null,
  ) => void;
  infiniteScrolling?: boolean;
  loadingMore?: boolean;
  hasMoreRows?: boolean;
  loadMoreError?: string | null;
  onLoadMore?: () => void;
  pageSize: number;
  page: number;
  totalCount: number | null;
  fastTableLoading?: boolean;
  countUnavailable?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onDuplicateRow: (row: any) => void;
  onCopyRowJSON: (row: any) => void;
  onCopyRowCSV: (row: any) => void;
  onFilterByCell?: (columnName: string, value: any) => void;
  onReplaceCell?: (rowIndex: number, columnName: string, newValue: any) => void;
  onReplaceAllCells?: (searchValue: string, replaceValue: string) => number;
  onCellClick?: (
    cell: { rowIndex: number; columnName: string },
    row: any,
  ) => void | Promise<void>;
  onOpenInsertSheet?: () => void;
  onNavigateToTable?: (
    schema: string,
    table: string,
    filterColumn: string,
    filterValue: any,
  ) => void;

  rowSpacing?: "compact" | "standard" | "relaxed";
  alternatingRowColors?: boolean;
  foreignKeys?: Array<{
    column_name: string;
    foreign_table_schema: string;
    foreign_table_name: string;
    foreign_column_name: string;
  }>;
  enums?: Array<{
    schema: string;
    name: string;
    values: string[];
  }>;
  enableColumnHover?: boolean;
  showAddColumn?: boolean;
  showHeaderIcons?: boolean;
  renderSelectionCell?: (row: any) => React.ReactNode;
  selectionColumnWidth?: number;
  stickySelectionColumn?: boolean;
  stickyFirstDataColumn?: boolean;
  stickyHeader?: boolean;
  showPaginationFooter?: boolean;
  isKeyboardInputSuspended?: boolean;

  glassmorphicHeaders?: boolean;
  gridAnimations?: boolean;
  sleekSelection?: boolean;
  colorizedPills?: boolean;
  relativeDates?: boolean;
  richJsonInspector?: boolean;
  dataBars?: boolean;
  skeletonLoaders?: boolean;
  whimsicalEmptyStates?: boolean;
  hiddenColumns?: string[];
  pendingSearchValue?: string | null;
  onConsumeSearchValue?: () => void;
  /** Column-name -> display decorator (data dictionary). Applied to
   *  displayValue only; raw values still drive editing, filtering, and —
   *  unless masked — copy. */
  columnDecorators?: Record<string, ColumnDecorator>;

  // --- Host integration -------------------------------------------------

  /**
   * Loads the row a foreign-key cell points at, for the preview popover
   * opened from the cell's arrow button. Without it the button does nothing.
   */
  fetchReferencedRecord?: (
    schema: string,
    table: string,
    keyValues: Record<string, unknown>,
  ) => Promise<ReferencedRecordResult>;
  /**
   * Reloads the table's foreign keys when `foreignKeys` lacks the clicked
   * column (stale cache, partial metadata).
   */
  fetchForeignKeys?: (schema: string, table: string) => Promise<ForeignKeysResult>;
  /** Renders the "Add column" sheet, opened from the trailing header. */
  renderAddColumnSheet?: (context: ColumnSheetContext) => React.ReactNode;
  /** Renders the "Edit column" sheet for `columnToEdit`. */
  renderEditColumnSheet?: (
    context: ColumnSheetContext & { columnName: string | null },
  ) => React.ReactNode;
  /** "Retry" in the load-error state. */
  onRetry?: () => void;
  /** "Refresh table" in the empty-table state. */
  onRefresh?: () => void;
  /** Changes whenever the host theme changes, so the canvas repaints. */
  themeKey?: GridThemeKey;
  /** Light or dark, when it cannot be read from a `.dark` class on `<html>`. */
  colorScheme?: GridColorScheme;
}

export type { ColumnDecorator, StudioForeignKey };
