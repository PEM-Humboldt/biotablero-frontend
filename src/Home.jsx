/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';

import Content from './home/Content';
import Information from './home/Information';
import ShortInfo from './commons/ShortInfo';
import Layout from './Layout';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeModule: 'search',
      loginModal: props.referrer === '/GEB/Compensaciones',
    };
  }

  setActiveModule = (name) => {
    this.setState({ activeModule: name });
  }

  render() {
    const {
      callbackUser, userLogged,
    } = this.props;
    const { activeModule, loginModal } = this.state;
    return (
      <Layout
        showFooterLogos
        userLogged={userLogged}
        callbackUser={callbackUser}
      >
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={loginModal}
          onClose={() => this.setState({ loginModal: false })}
          disableAutoFocus
        >
          <div className="generalAlarm">
            <h2>
              <b>Inicie sesión</b>
              <br />
              para ver contenido de compensaciones
            </h2>
            <button
              type="button"
              className="closebtn"
              onClick={() => this.setState({ loginModal: false })}
              data-tooltip
              title="Cerrar"
            >
              <CloseIcon />
            </button>
          </div>
        </Modal>
        <div className="wrapper">
          <ShortInfo
            name="BioTablero"
            description="reúne herramientas web para consultar cifras e indicadores y facilitar la toma de decisiones sobre biodiversidad, llevando a autoridades ambientales y empresas privadas síntesis de la información existente, actualizada y confiable en un contexto regional y nacional."
            tooltip="¿Qué es BioTablero?"
            className="hidden"
          />
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
  referrer: PropTypes.string,
};

Home.defaultProps = {
  userLogged: null,
  referrer: '',
};

export default Home;
