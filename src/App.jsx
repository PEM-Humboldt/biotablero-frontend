/** eslint verified */
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import ShortInfo from './home/ShortInfo';
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

  loadHome = (props) => {
    const { user } = this.state;
    return (
      <Home
        userLogged={user}
        callbackUser={this.callbackUser}
        {...props}
      />
    );
  }

  loadSearch = (props) => {
    const { user } = this.state;
    return (
      <Search
        userLogged={user}
        callbackUser={this.callbackUser}
        {...props}
      />
    );
  }

  loadIndicator = (props) => {
    const { user } = this.state;
    return (
      <Indicator
        userLogged={user}
        callbackUser={this.callbackUser}
        {...props}
      />
    );
  }

  loadCompensator = (props) => {
    const { user } = this.state;
    if (user) {
      return (
        <Compensation
          userLogged={user}
          callbackUser={this.callbackUser}
          {...props}
        />
      );
    }
    const newProps = { ...props };
    newProps.location.pathname = '/';
    return this.loadHome(newProps);
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
    // TODO: Change path to Home when user get
    return (
      <main>
        <Switch>
          <Route exact path="/" render={this.loadHome} />
          <Route path="/Consultas" render={this.loadSearch} />
          <Route path="/Indicadores" render={this.loadIndicator} />
          <Route path="/GEB/Compensaciones" component={this.loadCompensator} />
          <Route path="/Alertas" render={this.loadHome} />
          <Route path="/ShortInfo" component={ShortInfo} />
        </Switch>
      </main>
    );
  }
}

export default App;
