/** eslint verified */
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import ShortInfo from './home/ShortInfo';
import Search from './Search';
import Compensation from './Compensation';
import './assets/main.css';

const App = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/ShortInfo" component={ShortInfo} />
      <Route path="/Consultas" component={Search} />
      <Route path="/Compensaciones" component={Compensation} />
      <Route path="/Alertas" component={Home} />
    </Switch>
  </main>
);

export default App;
