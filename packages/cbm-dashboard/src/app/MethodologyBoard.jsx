import React, { useState } from 'react';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import PropTypes from 'prop-types';

import M01 from './M01';
import M02 from './M02';
import M06 from './M06';

const MethodologyBoard = ({ methodology }) => {
  const [activeTab, setActiveTab] = useState('GENERAL');

  return (
    <>
      <div
        className={`Montabs1 cardTab ${activeTab === 'GENERAL' ? 'cTactive' : ''}`}
        onClick={() => setActiveTab('GENERAL')}
        onKeyDown={() => setActiveTab('GENERAL')}
        role="button"
        tabIndex={0}
      >
        GENERAL
      </div>
      <div
        className={`Montabs2 cardTab ${activeTab === 'AMUSI' ? 'cTactive' : ''}`}
        onClick={() => setActiveTab('AMUSI')}
        onKeyDown={() => setActiveTab('AMUSI')}
        role="button"
        tabIndex={0}
      >
        AMUSI
      </div>
      <div
        className={`Montabs3 cardTab ${activeTab === 'ASICAC' ? 'cTactive' : ''}`}
        onClick={() => setActiveTab('ASICAC')}
        onKeyDown={() => setActiveTab('ASICAC')}
        role="button"
        tabIndex={0}
      >
        ASICAC
      </div>
      <div
        className={`Montabs4 cardTab ${activeTab === 'ASOBRASILAR' ? 'cTactive' : ''}`}
        onClick={() => setActiveTab('ASOBRASILAR')}
        onKeyDown={() => setActiveTab('ASOBRASILAR')}
        role="button"
        tabIndex={0}
      >
        ASOBRASILAR
      </div>
      <div className="Graph card">
        {methodology.id === '01_validacion_coberturas' && <M01 />}
        {methodology.id === '02_parcela_vegetacion' && <M02 />}
        {methodology.id === '06_medicion_lluvia' && <M06 />}
      </div>
      <div className="graphInfo card">
        <h2>{methodology.name}</h2>
        <h3>
          En este espacio se describe la forma como se debe interpretar los datos y leer cada
          gráfica a visualizar. El mismo cambiará en el momento de cambiar la gráfica, así como el
          título de la misma. De momento se encuentra con el título de la primera gráfica de la
          primera estrategia de monitoreo.
        </h3>
        {activeTab !== 'GENERAL' && (
          <h2>
            Cumplimiento <ThumbUpAltIcon /> <ThumbDownAltIcon />
          </h2>
        )}
      </div>
    </>
  );
};

MethodologyBoard.propTypes = {
  methodology: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

MethodologyBoard.defaultProps = {
  methodology: {
    id: '01_validacion_coberturas',
    name: 'Disturbios',
  },
};

export default MethodologyBoard;
