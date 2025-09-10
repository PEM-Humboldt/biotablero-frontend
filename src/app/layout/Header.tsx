import React from "react";

import { Menu } from "app/layout/header/Menu";
import { Title } from "app/layout/header/Title";
import { Uim } from "app/Uim";
import { UpdatedLayout, type LayoutActions } from "app/layout/layoutReducer";
import type { UserType } from "types/loginUimProps";

interface Names {
  parent?: string;
  child?: string;
}

interface HeaderProps {
  activeModule: string;
  headerNames: Names;
  layoutDispatch: React.Dispatch<LayoutActions>;
  user: UserType | null;
}

// TODO: revisar nombres de 'parent' y 'child', pueden ser confusos y la
// relación jerárquica al parecer está invertida

export function Header({
  activeModule,
  headerNames: { parent, child },
  user,
  layoutDispatch,
}: HeaderProps) {
  const handleSetUser = (userToSet: UserType | null) => {
    if (userToSet === null) {
      return;
    }

    layoutDispatch({
      type: UpdatedLayout.LOGGED_USER,
      user: userToSet,
    });
  };

  const handleLogOutUser = () => {
    layoutDispatch({ type: UpdatedLayout.LOGGED_OUT });
  };

  const renderCompositeTitle = parent !== "" && child !== "";

  return (
    <header className="cabezote">
      <div className="cabezoteLeft">
        <Title title="BioTablero" />
      </div>
      <div className="cabezoteRight">
        <Menu currentUser={user} />

        <div className="header_info">
          <div className="cabezoteRight">
            {renderCompositeTitle ? (
              <h1>
                <b>{child}</b>
                <br />
                {parent}
              </h1>
            ) : (
              <h2>{activeModule}</h2>
            )}
            <span className={`${activeModule.replace(" ", "")}`} />
          </div>

          <Uim
            currentUser={user}
            setUser={handleSetUser}
            logoutUser={handleLogOutUser}
          />
        </div>
      </div>
    </header>
  );
}
