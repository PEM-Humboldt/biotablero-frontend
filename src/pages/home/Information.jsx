import React from 'react';
import PropTypes from 'prop-types';

import AlertDescriptions from 'pages/home/information/Alerts';
import CompensationDescriptions from 'pages/home/information/Compensations';
import IndicatorDescriptions from 'pages/home/information/Indicators';
import SearchDescriptions from 'pages/home/information/Searches';
import CbmdDescriptions from 'pages/home/information/Cbmd';

class Information extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'queEs',
    };
    this.contentInfo = {
      search: SearchDescriptions,
      indicator: IndicatorDescriptions,
      compensation: CompensationDescriptions,
      alert: AlertDescriptions,
      cbmdashboard: CbmdDescriptions,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    return { activeModule: nextProps.activeModule };
  }

  render() {
    const { activeModule } = this.props;
    const { activeItem } = this.state;
    const { title, description } = this.contentInfo[activeModule]
      ? this.contentInfo[activeModule][activeItem] : { title: '', description: '' };
    return (
      <div className="menuline">
        <menu>
          <button
            type="button"
            className={`btnhome btn1 ${(activeItem === 'queEs') ? 'active' : ''}`}
            onClick={() => this.setState({ activeItem: 'queEs' })}
          >
            <b>
              01
            </b>
            {' ¿Qué es?'}
          </button>
          <button
            type="button"
            className={`btnhome btn2 ${(activeItem === 'porque') ? 'active' : ''}`}
            onClick={() => this.setState({ activeItem: 'porque' })}
          >
            <b>
              02
            </b>
            {' ¿Por qué?'}
          </button>
          <button
            type="button"
            className={`btnhome btn3 ${(activeItem === 'quienProduce') ? 'active' : ''}`}
            onClick={() => this.setState({ activeItem: 'quienProduce' })}
          >
            <b>
              03
            </b>
            {' ¿Quién produce?'}
          </button>
          <button
            type="button"
            className={`btnhome btn4 ${(activeItem === 'queEncuentras') ? 'active' : ''}`}
            onClick={() => this.setState({ activeItem: 'queEncuentras' })}
          >
            <b>
              04
            </b>
            {' ¿Qué encuentras?'}
          </button>
        </menu>
        <div className={`${activeModule}`}>
          <div className={`content ${activeItem}`}>
            <h1>
              {title}
            </h1>
            {description}
          </div>
        </div>
      </div>
    );
  }
}

Information.propTypes = {
  activeModule: PropTypes.string,
};

Information.defaultProps = {
  activeModule: '',
};

export default Information;
