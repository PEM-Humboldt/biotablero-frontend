/** eslint verified */
import React from 'react';
import MenuButton from './MenuButton';

const $ = require('jquery');

const geobtnFn = () => {
  $('.invisible').css('display', 'none');
  $('.finder').removeClass('activeicon');
  $('#geobtn').addClass('activeicon');
  $('.geocont').css('display', 'block');
};

const indbtnFn = () => {
  $('.invisible').css('display', 'none');
  $('.finder').removeClass('activeicon');
  $('#indbtn').addClass('activeicon');
  $('.indicont').css('display', 'block');
};

const combtnFn = () => {
  $('.invisible').css('display', 'none');
  $('.finder').removeClass('activeicon');
  $('#combtn').addClass('activeicon');
  $('.compcont').css('display', 'block');
};

const alebtnFn = () => {
  $('.invisible').css('display', 'none');
  $('.finder').removeClass('activeicon');
  $('#alebtn').addClass('activeicon');
  $('.alertcont').css('display', 'block');
};

// TODO: Cambiar esta función a una clase, para definir dinámicamente
//  los estilos de imagen resaltada
const Content = () => (
  <div className="finderline">
    <MenuButton
      focusCallback={geobtnFn}
      buttonStyles="finder geo activeicon"
      idBtn="geobtn"
      firstLineContent="consultas"
      secondLineContent="geográficas"
      localLink="/Consultas"
    />
    <MenuButton
      focusCallback={indbtnFn}
      buttonStyles="finder ind"
      idBtn="indbtn"
      firstLineContent="indicadores de"
      secondLineContent="biodiversidad"
      localLink="Indicadores"
      externalLink="http://humboldt-156715.appspot.com/filters.html"
    />
    <MenuButton
      focusCallback={combtnFn}
      buttonStyles="finder com"
      idBtn="combtn"
      firstLineContent="compensación"
      secondLineContent="ambiental"
      localLink="/Compensaciones"
    />
    <MenuButton
      focusCallback={alebtnFn}
      buttonStyles="finder ale"
      idBtn="alebtn"
      firstLineContent="alertas"
      secondLineContent="tempranas"
      localLink="./Alertas"
    />
  </div>
);

export default Content;
