import { Menu } from "core/layout/mainLayout/header/Menu";
import { Uim } from "core/layout/Uim";
import { Link } from "react-router";

interface Names {
  title?: string;
  subtitle?: string;
}

interface HeaderProps {
  activeModule: string;
  headerNames: Names;
}

export function Header({ activeModule, headerNames }: HeaderProps) {
  const { title, subtitle } = headerNames;

  const renderCompositeTitle = title !== "" && subtitle !== "";

  return (
    <header className="flex flex-wrap justify-between items-center border-b border-b-grey min-h-[60px] md:h-[70px]!">
      <div className="flex gap-2 items-baseline p-2 md:px-8">
        <Link to="/">
          <h1 className="text-secondary font-semibold! m-0! text-xl! sm:text-2xl! md:text-5xl!">
            BioTablero
            <span className="sr-only">{activeModule}</span>
          </h1>
        </Link>

        <Menu />

        {renderCompositeTitle && (
          <h2 className="text-xl! font-light! border-l border-l-grey-light px-4! m-0!">
            {title} / {subtitle}
          </h2>
        )}
      </div>

      <Uim />

      {activeModule !== "" && (
        <div
          className="flex gap-2 pl-8 pr-2 items-center bg-grey-light h-full"
          aria-hidden="true"
        >
          <span className="text-base md:text-lg font-normal">
            {activeModule}
          </span>
          <span
            className={`moduleIcon ${activeModule.replace(" ", "")}`}
            aria-hidden="true"
          />
        </div>
      )}
    </header>
  );
}
