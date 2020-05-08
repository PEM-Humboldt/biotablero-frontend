/** eslint verified */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from './Home';
import Search from './Search';
import Compensation from './Compensation';
import Indicator from './Indicator';
import './assets/main.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  buildQuery = queryString => new URLSearchParams(queryString);

  loadHome = ({ location }) => {
    const { user } = this.state;
    return (
      <Home
        userLogged={user}
        callbackUser={this.callbackUser}
        referrer={location.referrer}
      />
    );
  }

  loadSearch = ({ location }) => {
    const query = this.buildQuery(location.search);
    const { user } = this.state;
    return (
      <Search
        userLogged={user}
        callbackUser={this.callbackUser}
        areaTypeId={query.get('area_type')}
        areaIdId={query.get('area_id')}
      />
    );
  }

  loadIndicator = () => {
    const { user } = this.state;
    return (
      <Indicator
        userLogged={user}
        callbackUser={this.callbackUser}
      />
    );
  }

  loadCompensator = ({ location }) => {
    const { user } = this.state;
    if (user) {
      return (
        <Compensation
          userLogged={user}
          callbackUser={this.callbackUser}
        />
      );
    }
    return (
      <Redirect
        to={{
          pathname: '/',
          referrer: location.pathname,
        }}
      />
    );
  }

  callbackUser = (user) => {
    if (user) {
      this.setState({ user });
    } else {
      this.setState({ user: null });
    }
    return user;
  };

  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/" render={this.loadHome} />
          <Route path="/Consultas" render={this.loadSearch} />
          <Route path="/Indicadores" render={this.loadHome} />
          <Route path="/GEB/Compensaciones" component={this.loadCompensator} />
          <Route path="/Alertas" render={this.loadHome} />
        </Switch>
      </main>
    );
  }
}

export default App;
