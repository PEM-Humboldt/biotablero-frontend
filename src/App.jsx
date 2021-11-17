import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import AppContext from 'app/AppContext';
import Layout from 'app/Layout';
import Uim from 'app/Uim';
import Compensation from 'pages/Compensation';
import Home from 'pages/Home';
import Search from 'pages/Search';
import CBMDashboard from 'pages/CBMDashboard';
import Indicator from 'pages/Indicator';
import Portfolio from 'pages/Portfolio';

import isFlagEnabled from 'utils/isFlagEnabled';

import 'main.css';
import 'cbm-dashboard/dist/bundle.css';
import 'indicators/dist/bundle.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      headerNames: {},
      indicatorsFlag: false,
    };
  }

  componentDidMount() {
    isFlagEnabled('indicatorsModule')
      .then((value) => this.setState({ indicatorsFlag: value }));
  }

  buildQuery = (queryString) => new URLSearchParams(queryString);

  setUser = (user) => this.setState({ user });

  setHeaderNames = (parent, child) => {
    this.setState({
      headerNames: { parent, child },
    });
  }

  loadHome = ({ location }) => (
    this.loadComponent({
      logoSet: 'default',
      component: (<Home referrer={location.referrer} />),
    })
  );

  loadSearch = ({ location }) => {
    const query = this.buildQuery(location.search);
    return this.loadComponent({
      logoSet: null,
      name: 'Consultas geográficas',
      component: (<Search
        selectedAreaTypeId={query.get('area_type')}
        selectedAreaId={query.get('area_id')}
        setHeaderNames={this.setHeaderNames}
      />),
      className: 'fullgrid',
    });
  }

  loadIndicator = () => (
    this.loadComponent({
      logoSet: null,
      name: 'Indicadores',
      component: (<Indicator />),
      className: 'fullgrid',
    })
  );

  loadCompensator = ({ location }) => {
    const { user } = this.state;
    if (user) {
      return this.loadComponent({
        logoSet: null,
        name: 'Compensación ambiental',
        component: (<Compensation setHeaderNames={this.setHeaderNames} />),
        className: 'fullgrid',
      });
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

  loadPortfolio = () => (
    this.loadComponent({
      logoSet: null,
      name: 'Portafolios',
      component: (<Portfolio />),
      className: 'fullgrid',
    })
  );

  loadCBMDashboard = () => (
    this.loadComponent({
      logoSet: 'monitoreo',
      name: 'Monitoreo comunitario',
      component: (<CBMDashboard />),
      className: 'fullgrid',
    })
  );

  loadComponent = ({
    logoSet, name, component, className = '',
  }) => {
    const { headerNames } = this.state;
    return (
      <Layout
        moduleName={name}
        footerLogos={logoSet}
        headerNames={headerNames}
        uim={<Uim setUser={this.setUser} />}
        className={className}
      >
        {component}
      </Layout>
    );
  }

  render() {
    const { user, indicatorsFlag } = this.state;
    return (
      <AppContext.Provider
        value={{ user }}
      >
        <main>
          <Switch>
            <Route exact path="/" render={this.loadHome} />
            <Route path="/Consultas" render={this.loadSearch} />
            <Route path="/Indicadores" render={indicatorsFlag ? this.loadIndicator : this.loadHome} />
            <Route path="/GEB/Compensaciones" component={this.loadCompensator} />
            <Route path="/Portafolios" render={this.loadPortfolio} />
            <Route path="/Alertas" render={this.loadHome} />
            <Route path="/Monitoreo" render={this.loadCBMDashboard} />
          </Switch>
        </main>
      </AppContext.Provider>
    );
  }
}

export default App;
