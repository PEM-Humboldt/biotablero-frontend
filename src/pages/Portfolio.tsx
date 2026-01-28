import { useOutletContext } from "react-router";
import type { UiManager } from "core/layout/MainLayout";
import { useEffect } from "react";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { uiText } from "pages/portfolio/layout/uiText";

import { CirclePlus } from "lucide-react";

export function Portfolio() {
  const { layoutDispatch } = useOutletContext<UiManager>();

  useEffect(() => {
    layoutDispatch({
      type: LayoutUpdated.CHANGE_SECTION,
      sectionData: {
        moduleName: "Portafolios",
        logos: new Set(),
      },
    });
  }, [layoutDispatch]);

  return (
    <div className="grid grid-cols-1 p-8 md:p-0 md:grid-cols-[2fr_3fr] min-h-full">
      <div className="md:bg-[url(/src/core/assets/bg2Port.png)] bg-no-repeat bg-top-left bg-contain md:p-16 xl:p-[15%] mx-auto flex flex-col justify-center">
        <h3 className="text-[4rem] border-b font-bold">{uiText.title}</h3>
        <p>{uiText.main}</p>
      </div>
      <div className="md:bg-[url(/src/core/assets/bg1Port.png)] bg-no-repeat bg-top-right bg-contain">
        <div className="flex h-full max-w-[900px] mx-auto flex-wrap gap-8 items-center content-center justify-center">
          {uiText.items.map((item) => (
            <div
              key={item.title}
              // NOTE: Se invierte el orden para que la secuencia en scree-reader tenga sentido
              className="flex flex-col-reverse justify-between bg-background shadow-xl rounded-3xl md:w-[300px] self-start px-4 md:aspect-square"
            >
              <div className="mt-4">
                <h4 className="border-b">{item.title}</h4>
                <p>{item.description}</p>
              </div>
              <div className="flex justify-between items-start">
                <time
                  dateTime={item.year}
                  className="bg-accent text-accent-foreground py-1 px-3 text-sm font-normal"
                >
                  {item.year}
                </time>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-accent hover:text-primary translate-x-4"
                >
                  <CirclePlus className="size-8" strokeWidth="1.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
