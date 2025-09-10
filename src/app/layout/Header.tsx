import React from "react";

import { Menu } from "app/layout/header/Menu";
import { Title } from "app/layout/header/Title";

interface Names {
  parent?: string;
  child?: string;
}

interface HeaderProps {
  activeModule: string;
  headerNames: Names;
  uim: React.ReactNode;
}

// TODO: revisar nombres de 'parent' y 'child', pueden ser confusos y la
// relación jerárquica al parecer está invertida

export function Header({
  activeModule,
  headerNames: { parent, child },
  uim,
}: HeaderProps) {
  return (
    <header className="cabezote">
      <div className="cabezoteLeft">
        <Title title="BioTablero" />
      </div>
      <div className="cabezoteRight">
        <nav>
          <Menu />
        </nav>

        <div className="header_info">
          <div className="cabezoteRight">
            {activeModule && !parent && !child && <h2>{`${activeModule}`}</h2>}
            {parent && child && (
              <h1>
                <b>{`${child}`}</b>
                <br />
                {parent}
              </h1>
            )}
            <div className={`${activeModule.replace(" ", "")}`} />
          </div>
          {uim}
        </div>
      </div>
    </header>
  );
}
