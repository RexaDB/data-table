import type {
  ComponentPropsWithoutRef,
  ComponentType,
  ElementType,
  ReactNode,
} from "react";

import type { IconProps } from "./icons";

/** Props the tables pass to `Button`. Matches shadcn/ui's Button. */
export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "icon" | "icon-sm";
}

/** Props the tables pass to `Checkbox`. Matches Radix / shadcn/ui. */
export interface CheckboxProps {
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  className?: string;
  "aria-label"?: string;
  disabled?: boolean;
}

/** Props the grid passes to `Calendar`. A subset of react-day-picker's single mode. */
export interface CalendarProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  onMonthChange?: (month: Date) => void;
  onPrevClick?: (month: Date) => void;
  onNextClick?: (month: Date) => void;
  initialFocus?: boolean;
  className?: string;
  classNames?: { day_selected?: string; day_today?: string };
}

/** Props the grid passes to `Sheet`, the side panel for expanded cell editors. */
export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modal?: boolean;
  contentProps?: {
    side?: "left" | "right";
    /** Keep the panel inside the nearest positioned container. */
    contained?: boolean;
    showCloseButton?: boolean;
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    className?: string;
  };
  children?: ReactNode;
}

/** Props the grid passes to `ConfirmDialog` before deleting a column. */
export interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: ReactNode;
  onConfirm: () => void;
  contentClassName?: string;
}

/** Props the grid passes to `CodeEditor` when editing JSON cells. */
export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  /** Always "json" today. */
  language?: string;
}

export type Icon = ComponentType<IconProps>;

export interface DataTableIcons {
  ArrowUp: Icon;
  Info: Icon;
  ChevronLeft: Icon;
  ChevronRight: Icon;
  X: Icon;
  ExternalLink: Icon;
  Table: Icon;
  Plus: Icon;
  CornerDownLeft: Icon;
  Maximize: Icon;
  Calendar: Icon;
}

/**
 * Every UI building block the tables render. Supply any subset to
 * `DataTableProvider` to use your design system's versions; the rest fall
 * back to the built-in ones. Shapes follow shadcn/ui, so its components can
 * be passed in unchanged.
 */
export interface DataTableComponents {
  Button: ComponentType<ButtonProps>;
  Input: ElementType;
  Checkbox: ComponentType<CheckboxProps>;
  Skeleton: ComponentType<{ className?: string }>;
  Tooltip: ElementType;
  TooltipTrigger: ElementType;
  TooltipContent: ElementType;
  ContextMenu: ElementType;
  ContextMenuTrigger: ElementType;
  ContextMenuContent: ElementType;
  Select: ElementType;
  SelectTrigger: ElementType;
  SelectValue: ElementType;
  SelectContent: ElementType;
  SelectItem: ElementType;
  Popover: ElementType;
  PopoverAnchor: ElementType;
  PopoverContent: ElementType;
  Calendar: ComponentType<CalendarProps>;
  Sheet: ComponentType<SheetProps>;
  SheetHeader: ElementType;
  SheetTitle: ElementType;
  SheetFooter: ElementType;
  ConfirmDialog: ComponentType<ConfirmDialogProps>;
  CodeEditor: ComponentType<CodeEditorProps>;
  icons: DataTableIcons;
}

/** What `DataTableProvider` accepts: any component may be swapped, icons one by one. */
export type DataTableComponentOverrides = {
  [K in Exclude<keyof DataTableComponents, "icons">]?: ElementType;
} & { icons?: Partial<{ [K in keyof DataTableIcons]: ElementType }> };
