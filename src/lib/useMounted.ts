import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// False during server render and hydration, true once running in the
// browser. Used to defer theme-dependent output (which the server can't
// know) until after hydration, without a setState-in-effect round trip.
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
