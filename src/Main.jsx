/** eslint verified */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import ShortInfo from './home/ShortInfo';
import Searcher from './Searcher';
import Compensator from './Compensator';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/ShortInfo" component={ShortInfo} />
      <Route path="/Consultas" component={Searcher} />
      <Route path="/Compensaciones" component={Compensator} />
      <Route path="/Alertas" component={Home} />
      <Redirect from="/" to="/Home" />
    </Switch>
  </main>
);

export default Main;
