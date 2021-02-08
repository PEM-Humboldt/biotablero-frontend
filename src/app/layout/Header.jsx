import React from 'react';
import PropTypes from 'prop-types';

import Menu from 'app/layout/header/Menu';
import Title from 'app/layout/header/Title';

const Header = ({
  activeModule,
  headerNames: { parent, child },
  uim,
}) => (
  <header className="cabezote">
    <div className="cabezoteLeft">
      <nav>
        <Menu />
      </nav>
      <Title title="BioTablero" subTitle={activeModule} />
    </div>
    {/* TODO: Sending active user information: image, userName, ...
        to be upload when user is active */}
    <div className="header_info">
      <div className="cabezoteRight">
        {activeModule && !parent && !child && (
          <h2>
            {`${activeModule}`}
          </h2>
        )}
        {parent && child && (
          <h1>
            <b>{`${child}`}</b>
            <br />
            {parent}
          </h1>
        )}
        <div className={`${activeModule.replace(/ /g, '')}`} />
      </div>
      {uim}
    </div>
  </header>
);

Header.propTypes = {
  activeModule: PropTypes.string,
  headerNames: PropTypes.shape({
    parent: PropTypes.string,
    child: PropTypes.string,
  }),
  uim: PropTypes.node,
};

Header.defaultProps = {
  activeModule: '',
  headerNames: { parent: null, child: null },
  uim: null,
};

export default Header;
