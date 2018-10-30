/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
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
    const { callbackUser, userLogged } = this.props;
    const { activeModule } = this.state;
    return (
      <Layout
        showFooterLogos
        callbackUser={callbackUser}
      >
        <div className="wrapper">
          <ShortInfo />
          <h1 className="maint">
            Explora Nuestros Módulos
          </h1>
          <Content
            activeModule={activeModule}
            setActiveModule={this.setActiveModule}
            userLogged={userLogged}
          />
          <Information activeModule={activeModule} />
        </div>
      </Layout>
    );
  }
}

Home.propTypes = {
  callbackUser: PropTypes.func.isRequired,
  userLogged: PropTypes.object,
};

Home.defaultProps = {
  userLogged: null,
};

export default Home;
