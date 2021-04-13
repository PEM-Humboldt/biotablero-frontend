import React from 'react';
import PropTypes from 'prop-types';

import AppContext from 'app/AppContext';
import MenuButton from 'pages/home/content/MenuButton';
import CssCarousel from 'pages/home/content/CssCarousel';

const Content = ({ activeModule, setActiveModule }) => {
  const modules = [
    {
      focusCallback: () => setActiveModule('search'),
      buttonStyles: `finder geo ${(activeModule === 'search') ? 'activeicon' : ''}`,
      idBtn: 'geobtn',
      firstLineContent: 'consultas',
      secondLineContent: 'geográficas',
      localLink: '/Consultas',
      auth: false,
    },
    {
      focusCallback: () => setActiveModule('indicator'),
      buttonStyles: `finder ind ${(activeModule === 'indicator') ? 'activeicon' : ''}`,
      idBtn: 'indbtn',
      firstLineContent: 'indicadores de',
      secondLineContent: 'biodiversidad',
      localLink: '/Indicadores',
      auth: false,
    },
    {
      focusCallback: () => setActiveModule('compensation'),
      buttonStyles: `finder com ${(activeModule === 'compensation') ? 'activeicon' : ''}`,
      idBtn: 'combtn',
      firstLineContent: 'compensación',
      secondLineContent: 'ambiental',
      localLink: '/GEB/Compensaciones',
      auth: true,
    },
    {
      focusCallback: () => setActiveModule('alert'),
      buttonStyles: `finder ale ${(activeModule === 'alert') ? 'activeicon' : ''}`,
      idBtn: 'alebtn',
      firstLineContent: 'alertas',
      secondLineContent: 'tempranas',
      localLink: '/Alertas',
      auth: false,
    },
    {
      focusCallback: () => setActiveModule('cbmdashboard'),
      buttonStyles: `finder mon ${(activeModule === 'cbmdashboard') ? 'activeicon' : ''}`,
      idBtn: 'monbtn',
      firstLineContent: 'Monitoreo',
      secondLineContent: 'comunitario',
      localLink: '/Monitoreo',
      auth: false,
    },
  ];
  return (
    <AppContext.Consumer>
      {({ user }) => {
        let modulesArray = modules;
        if (!user) {
          modulesArray = modules.filter((module) => !module.auth);
        }
        return (
          <div className="finderline">
            <CssCarousel
              itemsArray={modulesArray.map((module) => (
                <MenuButton
                  focusCallback={module.focusCallback}
                  buttonStyles={module.buttonStyles}
                  idBtn={module.idBtn}
                  firstLineContent={module.firstLineContent}
                  secondLineContent={module.secondLineContent}
                  localLink={module.localLink}
                />
              ))}
            />
          </div>
        );
      }}
    </AppContext.Consumer>
  );
};

Content.propTypes = {
  activeModule: PropTypes.string,
  setActiveModule: PropTypes.func,
};

Content.defaultProps = {
  activeModule: 'search',
  setActiveModule: null,
};

export default Content;
