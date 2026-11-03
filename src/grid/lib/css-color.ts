/** Normalizes a computed CSS color (hex or rgb/rgba) to hex for canvas painting. */
export function parseCssColor(value: string): string {
  const trimmed = value.trim();

  // Already hex — normalize
  const hexMatch = trimmed.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      // #RGB → #RRGGBB
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    if (hex.length === 4) {
      // #RGBA → #RRGGBBAA
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    if (hex.length === 6 || hex.length === 8) {
      return `#${hex}`;
    }
  }

  // rgb() or rgba()
  const rgbaMatch = trimmed.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/
  );
  if (rgbaMatch) {
    const r = Math.round(Math.min(255, Math.max(0, Number(rgbaMatch[1]))));
    const g = Math.round(Math.min(255, Math.max(0, Number(rgbaMatch[2]))));
    const b = Math.round(Math.min(255, Math.max(0, Number(rgbaMatch[3]))));
    const a = rgbaMatch[4] != null ? Math.min(1, Math.max(0, Number(rgbaMatch[4]))) : 1;
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    const hex = `${toHex(r)}${toHex(g)}${toHex(b)}`;
    if (a >= 1) return `#${hex}`;
    return `#${hex}${toHex(Math.round(a * 255))}`;
  }

  // Fallback — return as-is (best-effort)
  return trimmed;
}
