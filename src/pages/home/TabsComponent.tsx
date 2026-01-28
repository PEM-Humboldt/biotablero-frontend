import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/shadCN/component/tabs";

import { uiText } from "pages/home/layout/uiText";

export function ModulesTabs({ activeTab }: { activeTab: number | null }) {
  const currentCategory = activeTab ? (uiText.tabs[activeTab] ?? null) : null;
  return (
    <section className="border-t-100 border-t-accent">
      {!currentCategory ? (
        <>
          <h2 className="-mt-17 bg-accent px-4 uppercase text-5xl! text-accent-foreground font-normal! text-center">
            {uiText.main.title}
          </h2>
          <div className="max-w-[1200px] px-4 py-8 mx-auto grid grid-cols-1 gap-4 md:py-16 md:grid-cols-2 md:gap-8">
            {uiText.main.cards.map((card) => (
              <article
                key={card.title}
                className="bg-background p-8 rounded-xl"
              >
                <h3 className="flex gap-4 items-center text-primary">
                  {typeof card.image === "string" ? (
                    <img src={card.image} alt="" />
                  ) : (
                    <card.image className="size-8" strokeWidth="1.5" />
                  )}
                  {card.title}
                </h3>
                <p className="m-0!">{card.content}</p>
              </article>
            ))}
          </div>
        </>
      ) : (
        <Tabs
          defaultValue={currentCategory.sections[0].title}
          orientation="vertical"
          className="flex flex-row -mt-17 max-w-[1000px] mx-auto gap-8 pb-8"
        >
          <TabsList className="flex-1 flex flex-col bg-transparent h-auto items-stretch p-0 mt-1 justify-start">
            {currentCategory.sections.map((section, i) => (
              <TabsTrigger
                key={`${section.title}_${activeTab}`}
                value={section.title}
                className="flex gap-4 bg-background items-center justify-start py-4 px-8 m-0 text-xl group border-b border-b-grey-light data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:data-[state=inactive]:bg-blue-800 hover:text-primary-foreground hover:data-[state=inactive]:cursor-pointer"
              >
                <span className="flex items-center justify-center shrink-0 w-8 h-8 outline-2 outline-background data-[state=inactive]:outline-foreground text-base">
                  0{i + 1}
                </span>
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-col">
            <h2 className="bg-accent m-0 px-4 uppercase text-5xl! text-accent-foreground font-normal! text-left">
              {currentCategory.title}
            </h2>
            {currentCategory.sections.map((section) => (
              <TabsContent
                key={`${section.title}_${activeTab}`}
                value={section.title}
                className="flex-3 px-4 py-12"
              >
                {section.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      )}
    </section>
  );
}
