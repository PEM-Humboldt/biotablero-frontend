import React from 'react';
import BulletGroup from './charts/BulletGroup';
import './infoGraph.css';

var biomas_iavh_szh = require('./data/bullets.json');

class InfoGraph extends React.Component {

  render(){
    return(
      <div className="dashboard">
        {console.log('Bullets.json: '+JSON.stringify(biomas_iavh_szh))}
        <h4>{this.props.texto}</h4>
                {
                    biomas_iavh_szh.map((group, index) => {
                        const   vertical = group.vertical || false,
                                themeName = group.theme || null,
                                title = group.title || null,
                                charts = group.charts,
                                cls = group.class;
                        return  (
                            <BulletGroup
                                title={title}
                                vertical={vertical}
                                charts={charts}
                                themeName={themeName}
                                class={cls}
                                key={index}
                            ></BulletGroup>
                        );
                    })
                }

      </div>
  );
  }
}

export default InfoGraph;
