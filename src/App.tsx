import React, {useState, useEffect, ReactNode} from 'react';
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

import 'main.css';
import 'cbm-dashboard/dist/bundle.css';
import 'indicators/dist/bundle.css';

import isFlagEnabled from 'utils/isFlagEnabled';

import { LogosConfig } from "types/layoutTypes";
import * as H from 'history';

  // {hash: ""
  // key: "wk98il"
  // pathname: "/"
  // search: ""
  // state: undefined}

interface LocationTypes {
  hash: string;
  key: string;
  pathname: string;
  search: string;
  state: undefined;
  referrer?: string;
}

interface LoadComponentTypes {
  logoSet: keyof LogosConfig | null;
  name: string;
  component: ReactNode;
  className: string;
}

const App = (props:any) => {
  const [user, setUser] = useState(null);
  const [headerNames,setHeaderNames] = useState({});
  const [showCBMDashboard, setShowCBMDashboard] = useState(false);
console.log(props);
  useEffect(() => {
    isFlagEnabled('CBMModule')
      .then((value) => setShowCBMDashboard( value ))
  }, [])

  const buildQuery = (queryString: string) => new URLSearchParams(queryString);

  const setMyUser = () => setUser( user );

  const setMyHeaderNames = (parent: string, child: string) => {
    setHeaderNames({
      headerNames: { parent, child },
    });
  }

  const loadHome = ({location}:any) => (
    loadComponent({
      logoSet: 'default',
      name:'',
      component: (<Home referrer={location.referrer} />),
      className: 'fullgrid',
    })
  );

  const loadSearch = ({location}:any) => {
    const query = buildQuery(location.search);
    return loadComponent({
      logoSet: null,
      name: 'Consultas geográficas',
      component: (<Search
        selectedAreaTypeId={query.get('area_type')}
        selectedAreaId={query.get('area_id')}
        setHeaderNames={setMyHeaderNames}
      />),
      className: 'fullgrid',
    });
  }

  const loadIndicator = () => (
    loadComponent({
      logoSet: null,
      name: 'Indicadores',
      component: (<Indicator />),
      className: 'fullgrid',
    })
  );

  const loadCompensator = ({location}:any) => {
    if (user) {
      return loadComponent({
        logoSet: null,
        name: 'Compensación ambiental',
        component: (<Compensation setHeaderNames={setMyHeaderNames} />),
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

  const loadPortfolio = () => (
    loadComponent({
      logoSet: null,
      name: 'Portafolios',
      component: (<Portfolio />),
      className: 'fullgrid',
    })
  );

  const loadCBMDashboard = () => (
    loadComponent({
      logoSet: 'monitoreo',
      name: 'Monitoreo comunitario',
      component: (<CBMDashboard />),
      className: 'fullgrid',
    })
  );

  const loadComponent = ({
    logoSet, name, component, className = '',
  }: LoadComponentTypes) => {
    return (
      <Layout
        moduleName={name}
        footerLogos={logoSet}
        headerNames={headerNames}
        uim={<Uim setUser={setMyUser} />}
        className={className}
      >
        {component}
      </Layout>
    );
  }

 return (
  <AppContext.Provider
    value={{ user }}
  >
    <main>
      <Switch>
        <Route exact path="/" render={loadHome} />
        <Route path="/Consultas" render={loadSearch} />
        <Route path="/Indicadores" render={loadIndicator} />
        <Route path="/GEB/Compensaciones" component={loadCompensator} />
        <Route path="/Portafolios" render={loadPortfolio} />
        <Route path="/Alertas" render={loadHome} />
        <Route path="/Monitoreo" render={showCBMDashboard ? loadCBMDashboard : loadHome} />
      </Switch>
    </main>
  </AppContext.Provider>
 );
}

// class App2 extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       user: null,
//       headerNames: {},
//       showCBMDashboard: false
//     };
//   }

//   componentDidMount() {
//     isFlagEnabled('CBMModule')
//       .then((value) => this.setState({ showCBMDashboard: value }))
//   }

//   buildQuery = (queryString) => new URLSearchParams(queryString);


//   setUser = (user) => this.setState({ user });

//   setHeaderNames = (parent, child) => {
//     this.setState({
//       headerNames: { parent, child },
//     });
//   }

//   loadHome = ({ location }) => (
//     this.loadComponent({
//       logoSet: 'default',
//       name:'',
//       component: (<Home referrer={location.referrer} />),
//     })
//   );

//   loadSearch = ({ location }) => {
//     const query = this.buildQuery(location.search);
//     return this.loadComponent({
//       logoSet: null,
//       name: 'Consultas geográficas',
//       component: (<Search
//         selectedAreaTypeId={query.get('area_type')}
//         selectedAreaId={query.get('area_id')}
//         setHeaderNames={this.setHeaderNames}
//       />),
//       className: 'fullgrid',
//     });
//   }

//   loadIndicator = () => (
//     this.loadComponent({
//       logoSet: null,
//       name: 'Indicadores',
//       component: (<Indicator />),
//       className: 'fullgrid',
//     })
//   );

//   loadCompensator = ({ location }) => {
//     const { user } = this.state;
//     if (user) {
//       return this.loadComponent({
//         logoSet: null,
//         name: 'Compensación ambiental',
//         component: (<Compensation setHeaderNames={this.setHeaderNames} />),
//         className: 'fullgrid',
//       });
//     }
//     return (
//       <Redirect
//         to={{
//           pathname: '/',
//           referrer: location.pathname,
//         }}
//       />
//     );
//   }

//   loadPortfolio = () => (
//     this.loadComponent({
//       logoSet: null,
//       name: 'Portafolios',
//       component: (<Portfolio />),
//       className: 'fullgrid',
//     })
//   );

//   loadCBMDashboard = () => (
//     this.loadComponent({
//       logoSet: 'monitoreo',
//       name: 'Monitoreo comunitario',
//       component: (<CBMDashboard />),
//       className: 'fullgrid',
//     })
//   );

//   loadComponent = ({
//     logoSet, name, component, className = '',
//   }) => {
//     const { headerNames } = this.state;
//     return (
//       <Layout
//         moduleName={name}
//         footerLogos={logoSet}
//         headerNames={headerNames}
//         uim={<Uim setUser={this.setUser} />}
//         className={className}
//       >
//         {component}
//       </Layout>
//     );
//   }

//   render() {
//     const { user, showCBMDashboard } = this.state;
//     return (
//       <AppContext.Provider
//         value={{ user }}
//       >
//         <main>
//           <Switch>
//             <Route exact path="/" render={this.loadHome} />
//             <Route path="/Consultas" render={this.loadSearch} />
//             <Route path="/Indicadores" render={this.loadIndicator} />
//             <Route path="/GEB/Compensaciones" component={this.loadCompensator} />
//             <Route path="/Portafolios" render={this.loadPortfolio} />
//             <Route path="/Alertas" render={this.loadHome} />
//             <Route path="/Monitoreo" render={showCBMDashboard ? this.loadCBMDashboard : this.loadHome} />
//           </Switch>
//         </main>
//       </AppContext.Provider>
//     );
//   }
// }

export default App;
