"use client";

/**
 * Built-in UI the tables render when the host app does not supply its own
 * through `DataTableProvider`. Each one follows the shadcn/ui prop shape, so
 * an app that already has those components can pass them straight in.
 */

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "../utils/cn";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "./icons";
import type {
  ButtonProps,
  CalendarProps,
  CheckboxProps,
  CodeEditorProps,
  ConfirmDialogProps,
  SheetProps,
} from "./types";

// ---------------------------------------------------------------------------
// Button / Input / Skeleton
// ---------------------------------------------------------------------------

const BUTTON_VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-primary text-primary-foreground font-medium hover:bg-primary/90",
  outline:
    "border-border bg-background text-foreground hover:bg-muted/60 aria-expanded:bg-muted",
  secondary: "bg-muted text-foreground font-medium hover:bg-muted/60",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground aria-expanded:bg-muted",
  destructive: "bg-destructive font-medium text-white hover:bg-destructive/90",
};

const BUTTON_SIZES: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-8 px-3",
  sm: "h-7 gap-1.5 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
  icon: "size-8",
  "icon-sm": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "default", size = "default", type = "button", ...props },
    ref
  ) {
    return (
      <button
        className={cn(
          "focus-visible:ring-ring/50 inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-transparent text-[13px] whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          BUTTON_VARIANTS[variant],
          BUTTON_SIZES[size],
          className
        )}
        data-slot="button"
        ref={ref}
        type={type}
        {...props}
      />
    );
  }
);

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(function Input({ className, ...props }, ref) {
  return (
    <input
      className={cn(
        "border-input placeholder:text-muted-foreground h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-sm transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      data-slot="input"
      ref={ref}
      {...props}
    />
  );
});

export function Skeleton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("bg-muted animate-pulse rounded-md", className)}
      data-slot="skeleton"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground size-4 shrink-0 rounded-[4px] border outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {props.checked === "indeterminate" ? (
          <span className="h-0.5 w-2 rounded-full bg-current" />
        ) : (
          <CheckIcon className="size-3.5" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

export function Tooltip(
  props: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>
) {
  // Self-contained provider, so the table never requires one higher up.
  return (
    <TooltipPrimitive.Provider delayDuration={0}>
      <TooltipPrimitive.Root {...props} />
    </TooltipPrimitive.Provider>
  );
}

export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(
          "bg-popover text-popover-foreground border-border z-50 w-fit max-w-xs rounded-lg border px-3 py-1.5 text-xs shadow-md",
          className
        )}
        sideOffset={sideOffset}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}

// ---------------------------------------------------------------------------
// Context menu
// ---------------------------------------------------------------------------

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

export function ContextMenuContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        className={cn(
          "bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-lg border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

/** Menu row for `renderRowContextMenu` when the default menu is in use. */
export function ContextMenuItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>) {
  return (
    <ContextMenuPrimitive.Item
      className={cn(
        "focus:bg-muted relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground flex w-fit cursor-pointer items-center justify-between gap-2 rounded-lg border bg-transparent px-2.5 py-1 text-sm whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0",
        size === "sm" ? "h-7" : "h-8",
        className
      )}
      data-slot="select-trigger"
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "bg-popover text-popover-foreground relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-hidden rounded-lg border shadow-md",
          position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1">
          <ChevronUpIcon className="size-4" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "w-full min-w-(--radix-select-trigger-width) scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1">
          <ChevronDownIcon className="size-4" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "focus:bg-muted relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      data-slot="select-item"
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

// ---------------------------------------------------------------------------
// Popover
// ---------------------------------------------------------------------------

export const Popover = PopoverPrimitive.Root;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        className={cn(
          "bg-popover text-popover-foreground z-50 w-72 rounded-lg border p-4 shadow-md outline-none",
          className
        )}
        sideOffset={sideOffset}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

// ---------------------------------------------------------------------------
// Calendar (single-date month view)
// ---------------------------------------------------------------------------

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function sameDay(a: Date | undefined, b: Date) {
  return (
    !!a &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function Calendar({
  selected,
  onSelect,
  onMonthChange,
  onPrevClick,
  onNextClick,
  className,
  classNames,
}: CalendarProps) {
  const [month, setMonth] = React.useState(() => {
    const base = selected ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const today = new Date();
  const first = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)
    ),
  ];
  const shift = (delta: number) => {
    const next = new Date(month.getFullYear(), month.getMonth() + delta, 1);
    setMonth(next);
    onMonthChange?.(next);
    (delta < 0 ? onPrevClick : onNextClick)?.(next);
  };

  return (
    <div className={cn("p-3 text-sm", className)} data-slot="calendar">
      <div className="mb-2 flex items-center justify-between">
        <button
          aria-label="Previous month"
          className="hover:bg-muted rounded-md p-1"
          onClick={() => shift(-1)}
          type="button"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <span className="font-medium">
          {month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </span>
        <button
          aria-label="Next month"
          className="hover:bg-muted rounded-md p-1"
          onClick={() => shift(1)}
          type="button"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center" role="grid">
        {WEEKDAYS.map((day) => (
          <span className="text-muted-foreground py-1 text-xs" key={day}>
            {day}
          </span>
        ))}
        {cells.map((date, index) =>
          date ? (
            <button
              aria-pressed={sameDay(selected, date)}
              className={cn(
                "hover:bg-muted size-8 rounded-md text-sm",
                sameDay(today, date) && (classNames?.day_today ?? "bg-muted"),
                sameDay(selected, date) &&
                  (classNames?.day_selected ?? "bg-primary text-primary-foreground")
              )}
              key={date.getDate()}
              onClick={() => onSelect?.(date)}
              type="button"
            >
              {date.getDate()}
            </button>
          ) : (
            <span key={`pad-${String(index)}`} />
          )
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sheet (side panel)
// ---------------------------------------------------------------------------

export function Sheet({
  open,
  onOpenChange,
  modal = true,
  contentProps,
  children,
}: SheetProps) {
  const { className, onEscapeKeyDown, side = "right" } = contentProps ?? {};
  return (
    <DialogPrimitive.Root modal={modal} onOpenChange={onOpenChange} open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "bg-background text-foreground fixed inset-y-0 z-50 flex h-full w-[min(520px,92vw)] flex-col border-l shadow-lg outline-none",
            side === "right" ? "right-0" : "left-0 border-r border-l-0",
            className
          )}
          onEscapeKeyDown={onEscapeKeyDown}
          onInteractOutside={(event) => {
            if (!modal) event.preventDefault();
          }}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function SheetHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1 border-b px-4 py-3", className)}
      {...props}
    />
  );
}

export function SheetTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h2">) {
  return (
    <DialogPrimitive.Title
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  );
}

export function SheetFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 border-t p-4", className)}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Confirm dialog / code editor
// ---------------------------------------------------------------------------

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  contentClassName,
}: ConfirmDialogProps) {
  return (
    <DialogPrimitive.Root onOpenChange={onOpenChange} open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitive.Content
          className={cn(
            "bg-background text-foreground fixed top-1/2 left-1/2 z-50 grid w-[min(420px,92vw)] -translate-x-1/2 -translate-y-1/2 gap-3 rounded-xl border p-5 shadow-lg",
            contentClassName
          )}
          role="alertdialog"
        >
          <DialogPrimitive.Title className="text-base font-semibold">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-muted-foreground text-sm">
            {description}
          </DialogPrimitive.Description>
          <div className="flex justify-end gap-2 pt-2">
            <DialogPrimitive.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogPrimitive.Close>
            <Button
              className="bg-red-600 text-white hover:bg-red-500"
              onClick={() => {
                onConfirm();
                onOpenChange?.(false);
              }}
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <textarea
      autoFocus
      className="bg-background text-foreground min-h-0 flex-1 resize-none p-4 font-mono text-[13px] outline-none"
      onChange={(event) => onChange(event.target.value)}
      spellCheck={false}
      value={value}
    />
  );
}
