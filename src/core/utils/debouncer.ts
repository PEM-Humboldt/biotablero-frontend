/**
 * Creates a function that delays the execution of a callback until a
 * period of inactivity has passed. If called again before the delay ends,
 * the timer resets.
 *
 * @template A - Argument types of the callback.
 * @param callback - Function to execute after the delay.
 * @param seconds - Delay time in seconds (default is 0.5).
 * @returns A new function with debounce behavior.
 */
export function debouncer<A extends unknown[]>(
  callback: (...args: A) => void,
  seconds: number = 0.5,
) {
  let timeout: NodeJS.Timeout;

  return (...args: A) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, seconds * 1000);
  };
}
