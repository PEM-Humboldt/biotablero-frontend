import React from 'react';
import Menu from './header/Menu';
import Title from './header/Title';
import User from './header/Uim';
import './common/main.css';

class Header extends React.Component {
  render() {
    return (
		  <header>
          <div>
            <nav>
                <Menu />
            </nav>
            <Title title='BioTablero' subTitle='Prueba'/>
          </div>
          {/*TODO: Crear componente para manejo de usuarios,
             con actualización de la imagen y usuario en el
             Header en la página */}
          <User value='Uim'/>
		  </header>
    );
  }
}

export default Header;
