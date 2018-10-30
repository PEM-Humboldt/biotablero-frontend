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
          <Route exact path="/" component={Home} />
          <Route path="/ShortInfo" component={ShortInfo} />
          <Route path="/Consultas" render={this.loadSearch} />
          <Route path="/Alertas" component={Home} />
          <Route path="/GEB/Compensaciones" render={this.loadCompensator} />
        </Switch>
      </main>
    );
  }
}

export default App;
