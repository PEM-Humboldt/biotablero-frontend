import { type Dispatch, type SetStateAction, useMemo } from "react";
import { Link } from "react-router";
import { Info } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@ui/shadCN/component/carousel";
import { Button } from "@ui/shadCN/component/button";
import { useUserCTX } from "@hooks/UserContext";
import { cn } from "@ui/shadCN/lib/utils";

import {
  type DisplayModule,
  displayModules,
} from "core/layout/mainLayout/modules";

type CarrouselProps = {
  activeTab: number | null;
  setActiveTab: Dispatch<SetStateAction<number | null>>;
};

export function ModulesCarousel({ activeTab, setActiveTab }: CarrouselProps) {
  const { user } = useUserCTX();

  const modules = useMemo<DisplayModule[]>(() => {
    return displayModules(user?.username, user?.company?.name);
  }, [user?.username, user?.company?.name]);

  const handleClick = (id: number) => {
    if (activeTab === id) {
      setActiveTab(null);
    } else {
      setActiveTab(id);
    }
  };

  return (
    <div className="bg-[url(/src/pages/home/assets/biotablero-slider.webp)] bg-cover bg-center">
      <h3 className="text-center p-6 text-5xl uppercase font-light bg-grey-light">
        Explora nuestros módulos
      </h3>
      <div className="flex justify-center px-12 py-6 md:py-12 lg:py-20">
        <Carousel className="w-full max-w-[1200px] mx-2">
          <CarouselContent className="-ml-[5%]">
            {modules.map((module) => (
              <CarouselItem
                key={module.id}
                className="basis-full md:basis-1/2 lg:basis-1/3 pl-[5%]"
              >
                <ModuleCard
                  module={module}
                  setModule={handleClick}
                  isActive={module.id === activeTab}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant="carousel" />
          <CarouselNext variant="carousel" />
        </Carousel>
      </div>
    </div>
  );
}

function ModuleCard({
  module,
  isActive,
  setModule,
}: {
  module: DisplayModule;
  isActive: boolean;
  setModule: (moduleId: number) => void;
}) {
  return (
    <div
      className={cn(
        "outline outline-background m-1 rounded-2xl rounded-br-none overflow-hidden transition-all duration-300 ease-in-out bg-black/30",
        "sm:has-hover:bg-transparent sm:has-hover:hover:bg-black/60 scale-95 sm:has-hover:hover:scale-100",
      )}
    >
      <Link to={module.link} tabIndex={-1}>
        <div className="px-8 py-16">
          <img className="w-full" src={module.image} alt="" />
        </div>
      </Link>

      <div className="flex min-h-24 gap-2 items-center border-t border-background text-background font-normal text-xl">
        <Link to={module.link} className=" text-balance flex-1 p-4 m-0!">
          {module.title}
        </Link>
        <Button
          size="icon-lg"
          variant="ghost"
          className={cn(
            "text-background rounded-full mr-3",
            isActive ? "bg-accent" : "bg-none",
          )}
          onClick={() => setModule(module.id)}
        >
          <Info strokeWidth={1} className="size-10" />
        </Button>
      </div>
    </div>
  );
}
