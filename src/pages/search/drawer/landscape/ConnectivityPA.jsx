import PropTypes from 'prop-types';
import React from 'react';

import ConnectivityPAActual from 'pages/search/drawer/landscape/connectivity/ConnectivityPAActual';
import ConnectivityPAInTime from 'pages/search/drawer/landscape/connectivity/ConnectivityPAInTime';
import ConnectivityPAEE from 'pages/search/drawer/landscape/connectivity/ConnectivityPAEE';
import LandscapeAccordion from 'pages/search/drawer/landscape/LandscapeAccordion';

const ConnectivityPA = (props) => {
  const {
    handlerAccordionGeometry,
  } = props;

  const componentsArray = [
    {
      label: {
        id: 'protectedActual',
        name: 'Actual',
      },
      component: ConnectivityPAActual,
    },
    {
      label: {
        id: 'protectedInTime',
        name: 'Histórico',
      },
      component: ConnectivityPAInTime,
    },
    {
        label: {
          id: 'protectedEE',
          name: 'Por Ecosistemas estratégicos',
        },
        component: ConnectivityPAEE,
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

ConnectivityPA.propTypes = {
  handlerAccordionGeometry: PropTypes.func,
};

ConnectivityPA.defaultProps = {
  handlerAccordionGeometry: () => {},
};

export default ConnectivityPA;
