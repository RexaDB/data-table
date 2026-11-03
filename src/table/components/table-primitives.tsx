import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../utils/cn";

// forwardRef keeps refs working on React 18: column resizing measures header
// cells, and the row context menu anchors on the row.

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  ComponentPropsWithoutRef<"thead">
>(function TableHeader({ className, ...props }, ref) {
  return (
    <thead
      className={cn("[&_tr]:border-b", className)}
      data-slot="table-header"
      ref={ref}
      {...props}
    />
  );
});

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  ComponentPropsWithoutRef<"tbody">
>(function TableBody({ className, ...props }, ref) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      data-slot="table-body"
      ref={ref}
      {...props}
    />
  );
});

export const TableRow = forwardRef<
  HTMLTableRowElement,
  ComponentPropsWithoutRef<"tr">
>(function TableRow({ className, ...props }, ref) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      data-slot="table-row"
      ref={ref}
      {...props}
    />
  );
});

export const TableHead = forwardRef<
  HTMLTableCellElement,
  ComponentPropsWithoutRef<"th">
>(function TableHead({ className, ...props }, ref) {
  return (
    <th
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      data-slot="table-head"
      ref={ref}
      {...props}
    />
  );
});

export const TableCell = forwardRef<
  HTMLTableCellElement,
  ComponentPropsWithoutRef<"td">
>(function TableCell({ className, ...props }, ref) {
  return (
    <td
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      data-slot="table-cell"
      ref={ref}
      {...props}
    />
  );
});
