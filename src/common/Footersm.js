import React from 'react';
import './main.css';

class Footersm extends React.Component {
    render(){
        return(
          <div>
              <div className="footersm">
              <div className="ftright">
                <Link url="http://www.humboldt.org.co/es/"/>
              </div>
              <div className="ftright">
                <h3><a href="mailto:mlondono@humboldt.org.co">Contacto</a></h3>
              </div>
            </div>
          </div>
        );
      }
  }

function Link(props) {
  return (<a href={props.url}>Instituto de Investigación de Recursos Biológicos<br></br><b>Alexander von Humboldt</b></a>);
}

export default Footersm;
