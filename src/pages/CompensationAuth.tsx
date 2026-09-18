import type { UiManager } from "core/layout/MainLayout";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { Compensation } from "pages/Compensation";
import type { Names } from "@appTypes/layout";
import { useUserCTX } from "@hooks/UserCTX";
import { TriangleAlert } from "lucide-react";
import { uiText } from "./compensation/uiText";

// HACK: Este componente de redireccionamiento es temporal, existe mientras
// se actualiza el módulo de compensaciones a un componente de función
export function RenderCompensation() {
  const { user } = useUserCTX();
  const { layoutDispatch } = useOutletContext<UiManager>();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const renderCompensation = user?.username === "geb";

  useEffect(() => {
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

  return (!renderCompensation ? (
      <div className="bg-grey-light h-full">
        <section className="border-t-100 border-t-accent">
          <div className="max-w-[1200px] px-4 py-8 mx-auto grid grid-cols-1 gap-4 md:py-16 md:grid-cols-2 md:gap-8">
            <article
              key={
                user?.username == null
                  ? uiText.errors.restrictedAccess.title
                  : uiText.errors.unauthorizedUser.title
              }
              className="bg-background p-8 rounded-xl"
            >
              <h3 className="flex gap-4 items-center text-primary">
                <TriangleAlert className="size-8" strokeWidth="1.5" />
                {user?.username == null
                  ? uiText.errors.restrictedAccess.title
                  : uiText.errors.unauthorizedUser.title}
              </h3>
              <p className="m-0!">
                {user?.username == null
                  ? uiText.errors.restrictedAccess.description
                  : uiText.errors.unauthorizedUser.description}
              </p>
            </article>
          </div>
        </section>
      </div>
    ) : (
      <Compensation setHeaderNames={handleSetHeaderNames} user={user} />
    ));
}
