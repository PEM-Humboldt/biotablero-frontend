/** eslint verified */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import ShortInfo from './home/ShortInfo';
import Search from './Search';
import Compensation from './Compensation';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/ShortInfo" component={ShortInfo} />
      <Route path="/Consultas" component={Search} />
      <Route path="/Compensaciones" component={Compensation} />
      <Route path="/Alertas" component={Home} />
      <Redirect from="/" to="/Home" />
    </Switch>
  </main>
);

export default Main;
