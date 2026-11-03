import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };
export type IconComponent = (props: IconProps) => React.ReactNode;

/** Draws a 24x24 stroked icon in the same geometry as lucide. */
function icon(name: string, children: React.ReactNode): IconComponent {
  function Icon({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        aria-hidden
        className={["lucide", `lucide-${name}`, className].filter(Boolean).join(" ")}
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {children}
      </svg>
    );
  }
  Icon.displayName = `${name}Icon`;
  return Icon;
}

export const ArrowUpIcon = icon("arrow-up", <><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></>);
export const InfoIcon = icon("info", <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>);
export const ChevronLeftIcon = icon("chevron-left", <path d="m15 18-6-6 6-6" />);
export const ChevronRightIcon = icon("chevron-right", <path d="m9 18 6-6-6-6" />);
export const ChevronDownIcon = icon("chevron-down", <path d="m6 9 6 6 6-6" />);
export const ChevronUpIcon = icon("chevron-up", <path d="m18 15-6-6-6 6" />);
export const CheckIcon = icon("check", <path d="M20 6 9 17l-5-5" />);
export const XIcon = icon("x", <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>);
export const ExternalLinkIcon = icon("external-link", <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>);
export const TableIcon = icon("table-2", <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />);
export const PlusIcon = icon("plus", <><path d="M5 12h14" /><path d="M12 5v14" /></>);
export const CornerDownLeftIcon = icon("corner-down-left", <><path d="M20 4v7a4 4 0 0 1-4 4H4" /><path d="m9 10-5 5 5 5" /></>);
export const MaximizeIcon = icon("maximize-2", <><path d="M15 3h6v6" /><path d="m21 3-7 7" /><path d="m3 21 7-7" /><path d="M9 21H3v-6" /></>);
export const CalendarIcon = icon("calendar", <><path d="M8 2v4" /><path d="M16 2v4" /><rect height="18" rx="2" width="18" x="3" y="4" /><path d="M3 10h18" /></>);
