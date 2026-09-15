import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { Compensation } from "pages/Compensation";
import type { Names } from "@appTypes/layout";
import { useUserCTX } from "@hooks/UserCTX";
import { Modal } from "@mui/material";

// HACK: Este componente de redireccionamiento es temporal, existe mientras
// se actualiza el módulo de compensaciones a un componente de función
export function RenderCompensation() {
  const { user } = useUserCTX();
  const { layoutDispatch } = useOutletContext<UiManager>();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const renderCompensation = user?.username === "geb";

  useEffect(() => {
    if (!renderCompensation) {
      return;
    }

    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleInfo: { name: "Compensación Ambiental", icon: "compensations" },
        logos: new Set(),
        className: "fullgrid",
      },
    });
  }, [renderCompensation, pathname, navigate, layoutDispatch]);

  const handleSetHeaderNames = (names: Names) =>
    layoutDispatch({ type: LayoutUpdated.HEADER_NAMES, newHeader: names });

  return <>
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={!renderCompensation}
      disableAutoFocus
    >
      <div className="generalAlarm">
        <h2>
          <b>{user?.username == null ? "Acceso restringido" : "Usuario no autorizado"}</b>
          <br />
          {user?.username == null ? "Inicie sesión para acceder a la página." : "No tienes permisos para acceder a la página."}
        </h2>
        <button
          type="button"
          className="closebtn"
          title="Cerrar"
        >
        </button>
      </div>
    </Modal>
    {user?.username != null && <Compensation
      setHeaderNames={handleSetHeaderNames} user={user}
    />}
  </>;
}
