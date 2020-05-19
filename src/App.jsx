/** eslint verified */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from './Home';
import Search from './Search';
import Compensation from './Compensation';
import Indicator from './Indicator';
import './assets/main.css';
import Layout from './Layout';
import AppContext from './AppContext';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      headerNames: {},
    };
  }

  buildQuery = queryString => new URLSearchParams(queryString);

  loadHome = ({ location }) => {
    const { user } = this.state;
    return (
      <Layout
        showFooterLogos
      >
        <Home
          userLogged={user}
          callbackUser={this.callbackUser}
          referrer={location.referrer}
        />
      </Layout>
    );
  }

  loadSearch = ({ location }) => {
    const query = this.buildQuery(location.search);
    const { headerNames } = this.state;
    return (
      <Layout
        moduleName="Consultas"
        showFooterLogos={false}
        headerNames={headerNames}
      >
        <Search
          areaTypeId={query.get('area_type')}
          areaIdId={query.get('area_id')}
          setHeaderNames={this.setHeaderNames}
        />
      </Layout>
    );
  }

  loadIndicator = () => {
    return (
      <Layout
        moduleName="Indicadores"
        showFooterLogos
      >
        <Indicator />
      </Layout>
    );
  }

  loadCompensator = ({ location }) => {
    const { user } = this.state;
    if (user) {
      return (
        <Layout
          moduleName="Compensaciones"
          showFooterLogos={false}
        >
          <Compensation
            userLogged={user}
          />
        </Layout>
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

  setUser = user => this.setState({ user });

  setHeaderNames = (parent, child) => {
    this.setState({
      headerNames: { parent, child },
    });
  }

  render() {
    const { user } = this.state;
    return (
      <AppContext.Provider
        value={{ user, setUser: this.setUser }}
      >
        <main>
          <Switch>
            <Route exact path="/" render={this.loadHome} />
            <Route path="/Consultas" render={this.loadSearch} />
            <Route path="/Indicadores" render={this.loadHome} />
            <Route path="/GEB/Compensaciones" component={this.loadCompensator} />
            <Route path="/Alertas" render={this.loadHome} />
          </Switch>
        </main>
      </AppContext.Provider>
    );
  }
}

export default App;
