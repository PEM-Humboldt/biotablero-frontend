/** eslint verified */
import React from 'react';
import Content from './home/Content';
import Information from './home/Information';
import ShortInfo from './home/ShortInfo';
import Layout from './Layout';

const Home = () => (
  <Layout showFooterLogos>
    <div className="wrapper">
      <ShortInfo />
      <h1 className="maint">
        Explora Nuestros Módulos
      </h1>
      <Content />
      <Information />
    </div>
  </Layout>
);

export default Home;
