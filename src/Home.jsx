/** eslint verified */
import React from 'react';
import Content from './home/Content';
import Information from './home/Information';
import ShortInfo from './home/ShortInfo';
import Layout from './Layout';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeModule: 'search',
    };
  }

  setActiveModule = (name) => {
    this.setState({ activeModule: name });
  }

  render() {
    const { activeModule } = this.state;
    return (
      <Layout showFooterLogos>
        <div className="wrapper">
          <ShortInfo />
          <h1 className="maint">
            Explora Nuestros Módulos
          </h1>
          <Content
            activeModule={activeModule}
            setActiveModule={this.setActiveModule}
          />
          <Information activeModule={activeModule} />
        </div>
      </Layout>
    );
  }
}

export default Home;
