/** eslint verified */
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import ShortInfo from './home/ShortInfo';
import Search from './Search';
import Compensation from './Compensation';
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

  loadCompensator = (props) => {
    const { user } = this.state;
    return (
      <Compensation
        userLogged={user}
        callbackUser={this.callbackUser}
        {...props}
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
          <Route path="/GEB/Compensaciones" render={this.loadCompensator} />
          <Route path="/Alertas" render={this.loadHome} />
          <Route path="/ShortInfo" component={ShortInfo} />
        </Switch>
      </main>
    );
  }
}

export default App;
