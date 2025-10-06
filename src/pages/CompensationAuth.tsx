import type { UiManager } from "app/Layout";
import { LayoutUpdated } from "app/layout/layoutReducer";
import { useEffect } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router";
import { Compensation } from "pages/Compensation";
import type { Names } from "types/layoutTypes";
import { useUserCTX } from "app/UserContext";

// HACK: Este componente de redireccionamiento es temporal, existe mientras
// se actualiza el módulo de compensaciones a un componente de función
export function RenderCompensation() {
  const { user } = useUserCTX();
  const { layoutDispatch } = useOutletContext<UiManager>();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user: userInParams } = useParams();

  const renderCompensation = user?.username === "geb";

  useEffect(() => {
    if (!renderCompensation) {
      void navigate("/", {
        state: { prevUrl: pathname },
        replace: true,
      });

      return;
    }

    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleName: "Compensación Ambiental",
        logos: new Set(),
        className: "fullgrid",
      },
    });
  }, [renderCompensation, pathname, navigate, layoutDispatch]);

  const handleSetHeaderNames = (names: Names) =>
    layoutDispatch({ type: LayoutUpdated.HEADER_NAMES, newHeader: names });

  return <Compensation setHeaderNames={handleSetHeaderNames} user={user} />;
}
