import { useNavigate } from "react-router";
import { useEffect } from "react";

export let navigate: (to: string, options?: any) => void;

export function NavigationBridge() {
  const nav = useNavigate();

  useEffect(() => {
    navigate = nav;
  }, [nav]);

  return null;
}
