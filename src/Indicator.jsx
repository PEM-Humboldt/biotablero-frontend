/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import Layout from './Layout';
import CardManager from './indicator/CardManager';
import ChipManager from './indicator/ChipManager';

import { filtersData, cardsData } from './indicator/assets/selectorData';

class Indicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      counterSelectedIndicator: 1,
      filters: filtersData.map(category => (
        {
          ...category,
          ...category.filters.map(filter => ({ ...filter, selected: 'false' })),
        }
      )),
    };
  }

  handleCloseModal = () => {
    const { openModal } = this.state;
    this.setState({ openModal: !openModal });
  };

  handleChipDelete = () => {
    console.log('Acción borrar');
  }

  handleChipClick = () => {
    console.log('Acción click');
  }

  render() {
    const { callbackUser, userLogged } = this.props;
    const { counterSelectedIndicator, filters } = this.state;
    return (
      <Layout
        moduleName="Indicadores"
        showFooterLogos
        userLogged={userLogged}
        callbackUser={callbackUser}
      >
        <div id="filters">
          <div id="options">
            <h1>Filtros temáticos de indicadores</h1>
            <ChipManager filters={filters} />
          </div>
          <div className="filter-display-container">
            {`Mostrando ${counterSelectedIndicator === 0
              ? `todos los ${cardsData.length} indicadores`
              : `${counterSelectedIndicator === 1 ? '1 indicador' : `${counterSelectedIndicator} indicadores`}`}
            `}
          </div>
          <CardManager cardsData={cardsData} />
        </div>
      </Layout>
    );
  }
}

Indicator.propTypes = {
  callbackUser: PropTypes.func.isRequired,
  userLogged: PropTypes.object,
};

Indicator.defaultProps = {
  userLogged: null,
};

export default Indicator;
