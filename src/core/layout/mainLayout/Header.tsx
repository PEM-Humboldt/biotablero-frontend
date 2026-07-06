import { Link } from "react-router";
import { cn } from "@ui/shadCN/lib/utils";
import type { Names } from "@appTypes/layout";

import { Menu } from "core/layout/mainLayout/header/Menu";
import { Uim } from "core/layout/mainLayout/header/Uim";
import { modulesIcons } from "@assets/dictionaries/modulesIcons";

interface HeaderProps {
  activeModuleInfo: {
    name: string;
    icon: keyof typeof modulesIcons | null;
  };
  headerNames: Names;
  className?: string;
}

export function Header({
  activeModuleInfo,
  headerNames,
  className,
}: HeaderProps) {
  const { title, subtitle } = headerNames;

  const renderCompositeTitle = title !== "" || subtitle !== "";

  return (
    <header
      className={cn(
        "flex flex-wrap justify-between items-center border-b border-b-grey min-h-[60px] md:h-[70px]! isolate",
        className,
      )}
    >
      <div className="flex gap-2 items-baseline p-2 md:px-8">
        <Link to="/">
          <h1 className="text-secondary font-semibold! m-0! text-xl! sm:text-2xl! md:text-5xl!">
            BioTablero
            <span className="sr-only">{activeModuleInfo.name}</span>
          </h1>
        </Link>

        <Menu />

        {renderCompositeTitle && (
          <h2 className="text-xl! font-light! border-l border-l-grey-light px-4! m-0! truncate">
            {title} {subtitle !== "" ? `/ ${subtitle}` : ""}
          </h2>
        )}
      </div>

      <Uim />

      {activeModuleInfo.name !== "" && (
        <div
          className="flex gap-4 px-6 items-center bg-grey-light h-full"
          aria-hidden="true"
        >
          <span className="hidden lg:inline! text-base text-grey-dark md:text-lg font-normal">
            {activeModuleInfo.name}
          </span>
          {activeModuleInfo.icon && (
            <img
              src={modulesIcons[activeModuleInfo.icon]}
              className="w-14 h-14 fill-accent brightness-0 opacity-70"
              alt=""
            />
          )}
        </div>
      )}
    </header>
  );
}
