import { Item } from "pages/portfolio/Item";
import { useOutletContext } from "react-router";
import type { UiManager } from "core/layout/MainLayout";
import { useEffect } from "react";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { portfoliosTexts } from "pages/portfolio/layout/uiText";

export function Portfolio() {
  const { layoutDispatch } = useOutletContext<UiManager>();

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleName: "Portafolios",
        logos: new Set(),
        className: "fullgrid",
      },
    });
  }, [layoutDispatch]);

  return (
    <div className="wrapperPort">
      <div className="splitPort">
        <div className="colPort1">
          <h1 className="portTitle">{portfoliosTexts.title}</h1>
          <div className="portText1">
            {portfoliosTexts.mainParagraphs.map((parragraph, i) => (
              <p key={i}>{parragraph}</p>
            ))}
          </div>
        </div>
        <div className="colPort2">
          {portfoliosTexts.items.map((item) => (
            <div key={item.title} className={item.className}>
              <Item
                title={item.title}
                year={item.year}
                description={item.description}
                link={item.link}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
