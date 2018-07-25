import React from 'react';
import BulletGroup from './charts/BulletGroup';
import './infoGraph.css';

var biomas_iavh_szh = require('./data/bullets.json');

class InfoGraph extends React.Component {

  render(){
    return(
      <div className="graphcard">
       <h2>Título de la gráfica</h2>
      </div>
  );
  }
}

export default InfoGraph;
