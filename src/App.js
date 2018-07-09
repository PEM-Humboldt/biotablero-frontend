import React, { Component } from 'react';
import Header from './Header';
import Footer from './common/Footer';
import Main from './Main';
import './common/main.css';

class App extends Component {
  render () {
    return (
      <div>
        <Header />
        <div className="wrapper">
         <Main />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
