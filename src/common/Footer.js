import React from 'react';
// import logomads from './img/logomads.png';
import logohumboldt from './img/logohumboldt.png';
import logosiac from './img/logosiac.png';
import './main.css';

class Footer extends React.Component {
    render(){
        return(
          <div>
              <footer>
              <div className="ftright">
                <Link url="http://www.humboldt.org.co/es/" image={logohumboldt} />
              </div>
              <div className="ftright">
                <h4>Colaboradores</h4>
                {/* <Link url="http://www.minambiente.gov.co/" image={logomads} /> */}
                <Link url="http://www.siac.gov.co/siac.html" image={logosiac} />
                <h3><a href="mailto:mlondono@humboldt.org.co">Contacto</a></h3>
              </div>
            </footer>
          </div>
        );
      }
  }

function Link(props) {
  return (<a href={props.url}><img src={props.image} alt={""}></img></a>);
}

export default Footer;
