import { Menu } from "app/layout/header/Menu";
import { Title } from "app/layout/header/Title";
import { Uim } from "app/Uim";

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
    <header className="cabezote">
      <div className="cabezoteLeft">
        <Title title="BioTablero" />
      </div>
      <div className="cabezoteRight">
        <Menu />

        <div className="header_info">
          <div className="cabezoteRight">
            {renderCompositeTitle ? (
              <h1>
                <b>{title}</b>
                <br />
                {subtitle}
              </h1>
            ) : (
              <h2>{activeModule}</h2>
            )}
            <span className={`${activeModule.replace(" ", "")}`} />
          </div>

          <Uim />
        </div>
      </div>
    </header>
  );
}
