"use client";

import React from "react";
import { useDataTableComponents } from "../ui/provider";

/** "No table selected" / "Failed to load data" placeholder. */
export function NoResultsState({
  error,
  onRetry,
}: {
  error: string | null;
  onRetry?: () => void;
}) {
  const { Button, icons } = useDataTableComponents();
  const TableIcon = icons.Table;
  return (
    <div className="h-full flex items-center justify-center text-muted-foreground">
      <div className="text-center max-w-xs">
        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
          <TableIcon className="w-8 h-8 opacity-20" />
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          {error ? "Failed to load data" : "No table selected"}
        </h3>
        <p className="text-xs">
          {error || "Select a table from the sidebar to view its data directly."}
        </p>
        {error && onRetry && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={onRetry}
          >
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}

/** Friendlier empty-table view, shown with `whimsicalEmptyStates`. */
export function WhimsicalEmptyState({
  onOpenInsertSheet,
  onRefresh,
}: {
  onOpenInsertSheet?: () => void;
  onRefresh?: () => void;
}) {
  const { Button, icons } = useDataTableComponents();
  const TableIcon = icons.Table;
  const Plus = icons.Plus;
  return (
    <div className="h-full flex flex-col items-center justify-center bg-studio-bg animate-in fade-in duration-500">
      <div className="text-center max-w-md px-6">
        <div className="w-24 h-24 bg-studio-accent-purple/10 rounded-lg flex items-center justify-center mx-auto mb-6 relative">
          <TableIcon className="w-12 h-12 text-studio-accent-purple" />
          <div className="absolute -right-1 -top-1 w-8 h-8 bg-studio-bg border-2 border-studio-accent-purple rounded-lg flex items-center justify-center animate-bounce">
            <Plus className="w-4 h-4 text-studio-accent-purple" />
          </div>
        </div>
        <h3 className="text-sm font-bold text-foreground mb-2">
          This table is currently empty
        </h3>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Ready to start building? Insert your first row manually or use the SQL
          editor to import data.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={onOpenInsertSheet}
            className="w-full sm:w-auto bg-studio-accent-purple hover:bg-studio-accent-purple/90 text-black dark:text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Insert your first row
          </Button>
          <Button
            variant="outline"
            onClick={onRefresh}
            className="w-full sm:w-auto border-studio-border hover:bg-studio-row-hover"
          >
            Refresh table
          </Button>
        </div>
      </div>
    </div>
  );
}
