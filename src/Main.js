import React from 'react';
import Home from './Home';
import ShortInfo from './ShortInfo';
import Description from './home/Description';
import Searcher from './Searcher';
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
      <Redirect from="/" to="/Home" />
    </Switch>
  </main>
)

export default Main;
