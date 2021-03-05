import PropTypes from 'prop-types';
import React from 'react';

import CurrentPAConnectivity from 'pages/search/drawer/landscape/connectivity/CurrentPAConnectivity';
import TimelinePAConnectivity from 'pages/search/drawer/landscape/connectivity/TimelinePAConnectivity';
import CurrentSEPAConnectivity from 'pages/search/drawer/landscape/connectivity/CurrentSEPAConnectivity';
import LandscapeAccordion from 'pages/search/drawer/landscape/LandscapeAccordion';

const PAConnectivity = (props) => {
  const {
    handlerAccordionGeometry,
  } = props;

  const componentsArray = [
    {
      label: {
        id: 'currentPAConn',
        name: 'Actual',
      },
      component: CurrentPAConnectivity,
    },
    {
      label: {
        id: 'timelinePAConn',
        name: 'Histórico',
      },
      component: TimelinePAConnectivity,
    },
    {
        label: {
          id: 'currentSEPAConn',
          name: 'Por Ecosistemas estratégicos',
        },
        component: CurrentSEPAConnectivity,
      },
  ];
  return (
    <div style={{ width: '100%' }}>
      <LandscapeAccordion
        componentsArray={componentsArray}
        classNameDefault="m1"
        classNameSelected="m1 accordionSelected"
        handlerAccordionGeometry={handlerAccordionGeometry}
        level="2"
      />
    </div>
  );
};

PAConnectivity.propTypes = {
  handlerAccordionGeometry: PropTypes.func,
};

PAConnectivity.defaultProps = {
  handlerAccordionGeometry: () => {},
};

export default PAConnectivity;
