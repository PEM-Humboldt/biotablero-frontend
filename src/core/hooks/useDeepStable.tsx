import { useMemo, useRef } from "react";

/**
 * A custom hook that ensures referential stability for objects or arrays.
 * It performs a deep comparison of the value against a reference using stringification.
 * If the content remains identical, returns the previous memory reference, preventing  unnecessary re-renders or effect triggers in downstream components memoized with `memo`.
 *
 * @template T - The type of the value to be stabilized, typically an object or an array.
 * * @param value - The current value to be stabilized.
 * * @returns The original reference if the deep content has not changed; otherwise, the new reference.
 */
export function useDeepStable<T>(value: T): T {
  const ref = useRef(value);

  const memoizedValue = useMemo(() => {
    if (JSON.stringify(ref.current) !== JSON.stringify(value)) {
      ref.current = value;
    }
    return ref.current;
  }, [value]);

  return memoizedValue;
}
