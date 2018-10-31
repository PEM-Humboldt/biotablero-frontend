/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Content from './home/Content';
import Information from './home/Information';
import ShortInfo from './home/ShortInfo';
import Layout from './Layout';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeModule: 'search',
      openModal: false,
    };
  }


  setActiveModule = (name) => {
    this.setState({ activeModule: name });
  }

  handleCloseModal = () => {
    const { openModal } = this.state;
    this.setState({ openModal: !openModal });
  };

  render() {
    const {
      callbackUser, userLogged, ...props
    } = this.props;
    const { activeModule, openModal } = this.state;
    return (
      <Layout
        showFooterLogos
        userLogged={userLogged}
        callbackUser={callbackUser}
      >
        {(props.match.path === '/GEB/Compensaciones')
          && (
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={openModal}
            onClose={() => this.setUpRoute(props)}
            disableAutoFocus
          >
            <div className="generalAlarm">
              <h2>
                Inicie sesión para ver contenido de compensaciones
              </h2>
            </div>
          </Modal>)}
        <div className="wrapper">
          <ShortInfo />
          <h1 className="maint">
            Explora Nuestros Módulos
          </h1>
          <Content
            activeModule={activeModule}
            setActiveModule={this.setActiveModule}
            userLogged={userLogged}
            callbackUser={callbackUser}
            {...this.newProps}
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
