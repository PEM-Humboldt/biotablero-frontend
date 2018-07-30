import React from 'react';
import Home from './Home';
import Footersm from './common/Footersm';
import ShortInfo from './ShortInfo';
import Description from './home/Description';
import Searcher from './Searcher';
import Compensator from './Compensator';
import { Switch, Route, Redirect } from 'react-router-dom';

// Parte 2 de 3 del enrutador: Definir las rutas y componentes a enrutar
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/ShortInfo' component={ShortInfo}/>
      <Route path='/Description' component={Description}/>
      {/* TODO: Crear ruta válida para el componente Geo como librería */}
      {/* <Route path='/Consultas' component=
      {() => window.location.href = 'http://192.168.205.198:3000/index.html'}
      /> */}
      <Route path='/Consultas' component={Searcher}/>
      <Route path='/Compensaciones' component={Compensator}/>
      <Route path='/Alertas' component={Home}/>
      <Redirect from="/" to="/Home"/>
    </Switch>
    <Footersm />
  </main>
)

export default Main;
