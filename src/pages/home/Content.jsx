import React from 'react';
import PropTypes from 'prop-types';

import AppContext from 'app/AppContext';
import MenuButton from 'pages/home/content/MenuButton';

const Content = ({ activeModule, setActiveModule }) => (
  <AppContext.Consumer>
    {({ user }) => (
      <div className="finderline">
        <MenuButton
          focusCallback={() => setActiveModule('search')}
          buttonStyles={`finder geo ${(activeModule === 'search') ? 'activeicon' : ''}`}
          idBtn="geobtn"
          firstLineContent="consultas"
          secondLineContent="geográficas"
          localLink="/Consultas"
        />
        <MenuButton
          focusCallback={() => setActiveModule('indicator')}
          buttonStyles={`finder ind ${(activeModule === 'indicator') ? 'activeicon' : ''}`}
          idBtn="indbtn"
          firstLineContent="indicadores de"
          secondLineContent="biodiversidad"
          localLink="/Indicadores"
        />
        { user ? ( // TODO: Implementing user validation
          <MenuButton
            focusCallback={() => setActiveModule('compensation')}
            buttonStyles={`finder com ${(activeModule === 'compensation') ? 'activeicon' : ''}`}
            idBtn="combtn"
            firstLineContent="compensación"
            secondLineContent="ambiental"
            localLink="/GEB/Compensaciones"
          />
        )
          : '' }
        <MenuButton
          focusCallback={() => setActiveModule('alert')}
          buttonStyles={`finder ale ${(activeModule === 'alert') ? 'activeicon' : ''}`}
          idBtn="alebtn"
          firstLineContent="alertas"
          secondLineContent="tempranas"
          localLink="/Alertas"
        />
        <MenuButton
          focusCallback={() => setActiveModule('monitoreo')}
          buttonStyles={`finder mon ${(activeModule === 'monitoreo') ? 'activeicon' : ''}`}
          idBtn="monbtn"
          firstLineContent="Monitoreo"
          secondLineContent="comunitario"
          localLink="/Monitoreo"
        />
      </div>
    )}
  </AppContext.Consumer>
);

Content.propTypes = {
  activeModule: PropTypes.string,
  setActiveModule: PropTypes.func,
};

Content.defaultProps = {
  activeModule: 'search',
  setActiveModule: null,
};

export default Content;
