import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';

import Content from 'pages/home/Content';
import Information from 'pages/home/Information';
import ShortInfo from 'components/ShortInfo';

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
    const { activeModule, loginModal } = this.state;
    return (
      <>
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
          />
          <Information activeModule={activeModule} />
        </div>
      </>
    );
  }
}

Home.propTypes = {
  referrer: PropTypes.string,
};

Home.defaultProps = {
  referrer: '',
};

export default Home;
