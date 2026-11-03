// Data-dictionary display decorators: raw value -> display string.

export type ColumnDecorator =
  | {
      kind: "enum-map";
      /** raw value (stringified) -> label */
      mapping: Record<string, string>;
      /** raw value (stringified) -> pill color (CSS color, optional) */
      colors?: Record<string, string>;
    }
  | {
      kind: "mask";
      /** show this many trailing characters; 0 = full mask */
      visibleChars?: number;
      maskChar?: string;
    }
  | {
      kind: "prefix-suffix";
      prefix?: string;
      suffix?: string;
    }
  | {
      kind: "truncate";
      maxLength: number;
    }
  | {
      kind: "date-format";
      /** "relative" | "date" | "datetime" | "time" */
      format: string;
    };

export interface DecoratedDisplay {
  display: string;
  /** true when the raw value is hidden (masking) — callers must not copy it */
  masked: boolean;
}

function stringifyRaw(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export function applyColumnDecorator(
  value: unknown,
  decorator: ColumnDecorator | null | undefined,
): DecoratedDisplay {
  const fallback = stringifyRaw(value);
  if (value === null || value === undefined) return { display: "NULL", masked: false };
  if (!decorator) return { display: fallback, masked: false };

  switch (decorator.kind) {
    case "enum-map": {
      const label = decorator.mapping[stringifyRaw(value)];
      return { display: label ?? fallback, masked: false };
    }
    case "mask": {
      const maskChar = decorator.maskChar || "•";
      const visible = Math.max(0, Math.min(decorator.visibleChars ?? 0, fallback.length));
      const hidden = fallback.length - visible;
      if (hidden <= 0) return { display: fallback, masked: false };
      return {
        display: maskChar.repeat(Math.min(hidden, 64)) + fallback.slice(fallback.length - visible),
        masked: true,
      };
    }
    case "prefix-suffix": {
      return {
        display: `${decorator.prefix ?? ""}${fallback}${decorator.suffix ?? ""}`,
        masked: false,
      };
    }
    case "truncate": {
      const max = Math.max(1, Math.min(decorator.maxLength || 0, 10_000)) || 120;
      if (fallback.length <= max) return { display: fallback, masked: false };
      return { display: `${fallback.slice(0, max)}…`, masked: false };
    }
    case "date-format": {
      const date = value instanceof Date ? value : new Date(stringifyRaw(value));
      if (Number.isNaN(date.getTime())) return { display: fallback, masked: false };
      if (decorator.format === "relative") return { display: relativeTime(date), masked: false };
      try {
        if (decorator.format === "date") return { display: date.toLocaleDateString(), masked: false };
        if (decorator.format === "time") return { display: date.toLocaleTimeString(), masked: false };
        return { display: date.toLocaleString(), masked: false };
      } catch {
        return { display: fallback, masked: false };
      }
    }
    default:
      return { display: fallback, masked: false };
  }
}

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const abs = Math.abs(diffMs);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (abs < minute) return "just now";
  if (abs < hour) {
    const n = Math.floor(abs / minute);
    return `${n} min${n === 1 ? "" : "s"}${diffMs >= 0 ? " ago" : " from now"}`;
  }
  if (abs < day) {
    const n = Math.floor(abs / hour);
    return `${n} hour${n === 1 ? "" : "s"}${diffMs >= 0 ? " ago" : " from now"}`;
  }
  const n = Math.floor(abs / day);
  return `${n} day${n === 1 ? "" : "s"}${diffMs >= 0 ? " ago" : " from now"}`;
}
