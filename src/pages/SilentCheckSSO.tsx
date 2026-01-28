import { useEffect } from "react";

export const SilentCheckSSO = () => {
  useEffect(() => {
    if (window.parent) {
      window.parent.postMessage(window.location.href, window.location.origin);
    }
  }, []);
  
  return null;
};