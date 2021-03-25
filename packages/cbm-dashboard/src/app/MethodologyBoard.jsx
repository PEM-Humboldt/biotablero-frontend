import React from 'react';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import PropTypes from 'prop-types';

import M01 from './M01';
import M02 from './M02';
import M06 from './M06';

const MethodologyBoard = ({ methodology }) => {
  return (
    <>
      <div className="Montabs1 cardTab cTactive">GENERAL</div>
      <div className="Montabs2 cardTab">AMUSI</div>
      <div className="Montabs3 cardTab">ASICAC</div>
      <div className="Montabs4 cardTab">ASOBRASILAR</div>
      <div className="Graph card">
        {methodology === '01_validacion_coberturas' && <M01 />}
        {methodology === '02_parcela_vegetacion' && <M02 />}
        {methodology === '06_medicion_lluvia' && <M06 />}
      </div>
      <div className="graphInfo card">
        <h2>Disturbios</h2>
        <h3>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
          tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
          quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
          consequat.
        </h3>
        <h2>
          Periodicidad <ThumbUpAltIcon />
        </h2>
        <ThumbDownAltIcon />
      </div>
    </>
  );
};

MethodologyBoard.propTypes = {
  methodology: PropTypes.string,
};

MethodologyBoard.defaultProps = {
  methodology: '',
};

export default MethodologyBoard;
