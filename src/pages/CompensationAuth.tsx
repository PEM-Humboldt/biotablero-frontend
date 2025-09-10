import type { UiManager } from "app/Layout";
import { UpdatedLayout } from "app/layout/layoutReducer";
import { useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Compensation } from "pages/Compensation";
import type { Names } from "types/layoutTypes";

// HACK: Este componente de redireccionamiento es temporal mientras
// se actualiza el módulo de compensaciones a un módulo de función
export function RenderCompensation() {
  const { layoutState, layoutDispatch } = useOutletContext<UiManager>();

  const renderCompensation = layoutState.user !== null;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!renderCompensation) {
      navigate("/", {
        state: { prevUrl: pathname },
        replace: true,
      });
    }
    layoutDispatch({
      type: UpdatedLayout.CHANGE_SECTION,
      sectionData: {
        moduleName: "Compensación Ambiental",
        logos: new Set(),
        className: "fullgrid",
      },
    });
  }, [renderCompensation, pathname, navigate, layoutDispatch]);

  const handleSetHeaderNames = (names: Names) =>
    layoutDispatch({ type: UpdatedLayout.HEADER_NAMES, newHeader: names });

  return (
    <Compensation
      setHeaderNames={handleSetHeaderNames}
      user={layoutState.user}
    />
  );
}
