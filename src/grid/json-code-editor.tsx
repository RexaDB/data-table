"use client";

import { useDataTableComponents } from "../ui/provider";

export function formatJsonText(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return JSON.stringify(text, null, 2);
  }
}

/** JSON editing surface; the host's `CodeEditor` (e.g. Monaco) when one is provided. */
export function JsonCodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { CodeEditor } = useDataTableComponents();
  return <CodeEditor language="json" onChange={onChange} value={value} />;
}
