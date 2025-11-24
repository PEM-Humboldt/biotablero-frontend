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
    <header className="flex h-[90px] justify-between border-b border-b-grey">
      <div className="flex self-center px-8">
        <Link to="/">
          <h1 className="text-secondary font-semibold! m-0! text-xl sm:text-5xl!">
            BioTablero
            <span className="sr-only">{activeModule}</span>
          </h1>
        </Link>

        <Menu />
      </div>

      <div className="flex items-stretch">
        <Uim />

        {activeModule !== "" && (
          <div className="flex px-8 items-center bg-grey-light">
            {renderCompositeTitle ? (
              <h2 className="text-lg font-semibold text-right text-grey-dark">
                {title}
                <br />
                <span>{subtitle}</span>
              </h2>
            ) : (
              <h2
                className="text-lg font-normal! p-[18px] text-right m-0! text-grey-dark"
                aria-hidden="true"
              >
                {activeModule}
              </h2>
            )}
            <span className={`moduleIcon ${activeModule.replace(" ", "")}`} />
          </div>
        )}
      </div>
    </header>
  );
}
