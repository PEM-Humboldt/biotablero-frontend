/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import MenuButton from './MenuButton';

const Content = ({ activeModule, setActiveModule, userLogged }) => (
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
      localLink="Indicadores"
      externalLink="http://humboldt-156715.appspot.com/filters.html"
    />
    { userLogged ? ( // TODO: Implementing user validation
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
      localLink="./Alertas"
    />
  </div>
);

Content.propTypes = {
  activeModule: PropTypes.string,
  setActiveModule: PropTypes.func,
  userLogged: PropTypes.object,
};

Content.defaultProps = {
  activeModule: 'search',
  setActiveModule: null,
  userLogged: null,
};

export default Content;
