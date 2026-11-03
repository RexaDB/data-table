"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";

import * as defaults from "./defaults";
import * as icons from "./icons";
import type {
  DataTableComponentOverrides,
  DataTableComponents,
} from "./types";

export const DEFAULT_DATA_TABLE_COMPONENTS: DataTableComponents = {
  Button: defaults.Button,
  Input: defaults.Input,
  Checkbox: defaults.Checkbox,
  Skeleton: defaults.Skeleton,
  Tooltip: defaults.Tooltip,
  TooltipTrigger: defaults.TooltipTrigger,
  TooltipContent: defaults.TooltipContent,
  ContextMenu: defaults.ContextMenu,
  ContextMenuTrigger: defaults.ContextMenuTrigger,
  ContextMenuContent: defaults.ContextMenuContent,
  Select: defaults.Select,
  SelectTrigger: defaults.SelectTrigger,
  SelectValue: defaults.SelectValue,
  SelectContent: defaults.SelectContent,
  SelectItem: defaults.SelectItem,
  Popover: defaults.Popover,
  PopoverAnchor: defaults.PopoverAnchor,
  PopoverContent: defaults.PopoverContent,
  Calendar: defaults.Calendar,
  Sheet: defaults.Sheet,
  SheetHeader: defaults.SheetHeader,
  SheetTitle: defaults.SheetTitle,
  SheetFooter: defaults.SheetFooter,
  ConfirmDialog: defaults.ConfirmDialog,
  CodeEditor: defaults.CodeEditor,
  icons: {
    ArrowUp: icons.ArrowUpIcon,
    Info: icons.InfoIcon,
    ChevronLeft: icons.ChevronLeftIcon,
    ChevronRight: icons.ChevronRightIcon,
    X: icons.XIcon,
    ExternalLink: icons.ExternalLinkIcon,
    Table: icons.TableIcon,
    Plus: icons.PlusIcon,
    CornerDownLeft: icons.CornerDownLeftIcon,
    Maximize: icons.MaximizeIcon,
    Calendar: icons.CalendarIcon,
  },
};

const DataTableComponentsContext = createContext<DataTableComponents>(
  DEFAULT_DATA_TABLE_COMPONENTS
);

/**
 * Swaps the tables' UI building blocks for your own. Nest providers to
 * override per subtree; inner overrides layer on top of outer ones.
 */
export function DataTableProvider({
  components,
  children,
}: {
  components?: DataTableComponentOverrides;
  children: ReactNode;
}) {
  const parent = useContext(DataTableComponentsContext);
  const value = useMemo(
    () =>
      ({
        ...parent,
        ...components,
        icons: { ...parent.icons, ...components?.icons },
      }) as DataTableComponents,
    [parent, components]
  );
  return (
    <DataTableComponentsContext.Provider value={value}>
      {children}
    </DataTableComponentsContext.Provider>
  );
}

export function useDataTableComponents(): DataTableComponents {
  return useContext(DataTableComponentsContext);
}
