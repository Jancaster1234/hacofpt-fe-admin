// src/hooks/useEffectOnce.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

/**
 * Custom hook to run an effect only once, even in React Strict Mode
 * which double-invokes effects in development.
 *
 * @param effect Function to run (can return a cleanup function)
 * @param deps Dependencies array, similar to useEffect
 */
export function useEffectOnce(
  effect: () => void | (() => void),
  deps: any[] = []
) {
  const isFirstRender = useRef<boolean>(true);
  const cleanupFnRef = useRef<(() => void) | void>(undefined);

  useEffect(() => {
    // Skip the first effect execution in development (Strict Mode double invocation)
    if (process.env.NODE_ENV === "development" && isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Run the effect and store any cleanup function
    cleanupFnRef.current = effect();

    return () => {
      // Call any cleanup function from the effect
      if (cleanupFnRef.current) {
        cleanupFnRef.current();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
