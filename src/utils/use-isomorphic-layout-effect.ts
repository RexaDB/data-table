import { useEffect, useLayoutEffect } from "react";

/** `useLayoutEffect` in the browser, `useEffect` on the server (no SSR warning on React 18). */
export const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
