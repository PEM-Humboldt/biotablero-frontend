import React from "react";

import { Menu } from "app/layout/header/Menu";
import { Title } from "app/layout/header/Title";
import { Uim } from "app/Uim";
import { LayoutUpdated, type LayoutActions } from "app/layout/layoutReducer";
import type { UserType } from "types/loginUimProps";
import { useUserCTX } from "app/UserContext";

interface Names {
  title?: string;
  subtitle?: string;
}

interface HeaderProps {
  activeModule: string;
  headerNames: Names;
}

export function Header({
  activeModule,
  headerNames: { title: title, subtitle: subtitle },
}: HeaderProps) {
  const { user, login, logout } = useUserCTX();
  const handleSetUser = (userToSet: UserType | null) => {
    if (userToSet === null) {
      return;
    }
    login(userToSet);
  };

  const handleLogOutUser = () => {
    logout();
  };

  const renderCompositeTitle = title !== "" && subtitle !== "";

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
                <b>{title}</b>
                <br />
                {subtitle}
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
