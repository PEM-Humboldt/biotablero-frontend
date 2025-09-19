import { type UiManager } from "app/Layout";
import { useOutletContext } from "react-router";

type Path = `/${string}`;

export function usePassport(redirectTo: Path) {
  const { layoutState } = useOutletContext<UiManager>();
}
