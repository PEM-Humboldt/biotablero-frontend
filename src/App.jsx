/** eslint verified */
import React from 'react';
import Header from './Header';
import Main from './Main';
import './common/main.css';

const App = () => (
  /** TODO: Sending active module's name at the header */
  <div>
    <Header />
    <Main />
  </div>
);

export default App;
