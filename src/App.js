import React, { Component } from 'react';
import Header from './Header';
import Main from './Main';
import './common/main.css';

class App extends Component {
  // TODO: Pasar el nombre del módulo activo al título
  render () {
    return (
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}

export default App;
