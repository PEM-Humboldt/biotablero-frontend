import React from 'react';
import Content from './home/Content';
import Information from './home/Information';
import ShortInfo from './ShortInfo';
import Footer from './common/Footer';

class Home extends React.Component{
  render(){
    return(
      <div>
        <div className="wrapper">
          <ShortInfo />
          <h1 className="maint">Explora Nuestros Módulos</h1>
          <Content />
          <Information />
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home;
