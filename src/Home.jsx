/** eslint verified */
import React from 'react';
import Content from './home/Content';
import Information from './home/Information';
import ShortInfo from './home/ShortInfo';
import Footer from './Footer';

const Home = () => (
  <div>
    <div className="wrapper">
      <ShortInfo />
      <h1 className="maint">
        Explora Nuestros Módulos
      </h1>
      <Content />
      <Information />
    </div>
    <Footer showLogos />
  </div>
);

export default Home;
