import React from 'react';
import Content from './home/Content';
import Information from './home/Information';
import ShortInfo from './ShortInfo';

class Home extends React.Component{
  render(){
    return(
      <div>
        <ShortInfo />
        <h1 className="maint">Explora Nuestros Módulos</h1>
        <Content />
        <Information />
      </div>
    )
  }
}

export default Home;
