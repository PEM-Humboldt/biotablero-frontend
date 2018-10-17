/** eslint verified */
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import ShortInfo from './home/ShortInfo';
import Search from './Search';
import Compensation from './Compensation';
import './assets/main.css';

const loadSearch = props => (
  <Search
    userLogged={null}
    {...props}
  />
);

const loadCompensator = props => (
  <Compensation
    userLogged={{ value: true }}
    {...props}
  />
);

const App = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/ShortInfo" component={ShortInfo} />
      <Route path="/Consultas" render={loadSearch} />
      <Route path="/GEB/Compensaciones" render={loadCompensator} />
      <Route path="/Alertas" component={Home} />
    </Switch>
  </main>
);

export default App;
