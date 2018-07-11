import React from 'react';
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
                <Link url="http://www.siac.gov.co/siac.html" image={logosiac} />
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
