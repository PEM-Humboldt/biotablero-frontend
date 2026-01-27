import { uiText } from "pages/home/layout/uiText";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/shadCN/component/tabs";

type TabsModulesProps = {
  activeTab: number | null;
};

export function ModulesTabs({ activeTab }: TabsModulesProps) {
  const currentCategory =
    uiText.tabs.find((tab) => tab.id === activeTab) ?? null;

  return (
    <section className="bg-grey-light">
      {activeTab === null || !currentCategory ? (
        <>
          <h2 className="bg-accent m-0 py-8 px-4 uppercase text-5xl! text-accent-foreground font-normal! text-center">
            {uiText.main.title}
          </h2>
          <div className="max-w-[1200px] px-4 py-8 mx-auto grid grid-cols-1 gap-4 md:py-16 md:grid-cols-2 md:gap-8">
            {uiText.main.cards.map((card) => (
              <article className="bg-background p-8 rounded-xl">
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
        <>
          <h2 className="bg-accent m-0 py-8 px-4 uppercase text-5xl! text-accent-foreground font-normal! text-center">
            {currentCategory.title}
          </h2>

          <Tabs
            orientation="vertical"
            defaultValue={currentCategory.sections[0].title}
          >
            <TabsList>
              {currentCategory.sections.map((section) => (
                <TabsTrigger
                  key={`${section.title}_${activeTab}`}
                  value={section.title}
                >
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {currentCategory.sections.map((section) => (
              <TabsContent
                key={`${section.title}_${activeTab}`}
                value={section.title}
              >
                {section.content}
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </section>
  );
}
