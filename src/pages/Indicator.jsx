import React from 'react';

import CardManager from 'pages/indicator/CardManager';
import ChipManager from 'pages/indicator/ChipManager';
import { filtersData, cardsData } from 'pages/indicator/selectorData';

class Indicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      counterSelectedIndicator: 1,
      filters: filtersData.map((category) => (
        {
          ...category,
          ...category.filters.map((filter) => ({ ...filter, selected: 'false' })),
        }
      )),
    };
  }

  handleCloseModal = () => {
    const { openModal } = this.state;
    this.setState({ openModal: !openModal });
  };

  handleChipDelete = () => {
    // console.log('Acción borrar');
  }

  handleChipClick = () => {
    // console.log('Acción click');
  }

  render() {
    const { counterSelectedIndicator, filters } = this.state;
    return (
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
    );
  }
}

export default Indicator;
