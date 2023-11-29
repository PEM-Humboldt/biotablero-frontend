import React, { useState } from 'react';
//import PropTypes from 'prop-types';

import AlertDescriptions from 'pages/home/information/Alerts';
import CompensationDescriptions from 'pages/home/information/Compensations';
import IndicatorDescriptions from 'pages/home/information/Indicators';
import PortfolioDescriptions from 'pages/home/information/Portfolio';
import SearchDescriptions from 'pages/home/information/Searches';
import CbmdDescriptions from 'pages/home/information/Cbmd';

interface InformationTypes {
  activeModule: string;
}

const Information: React.FC<InformationTypes> = ({ activeModule="" }) => {
  const [activeItem, setActiveItem] = useState<string>('queEs');
  
  interface descriptionsTypes {
    title: string;
    description: JSX.Element;
  }
  interface BasicTitleTypes {
    queEs:  descriptionsTypes;
    porque:  descriptionsTypes;
    quienProduce:  descriptionsTypes;
    queEncuentras:  descriptionsTypes;
  }
  interface ContentinfoTypes {
    search:  BasicTitleTypes;
    indicator:  BasicTitleTypes;
    portfolio:  BasicTitleTypes;
    compensation:  BasicTitleTypes;
    alert:  BasicTitleTypes;
    cbmdashboard:  BasicTitleTypes;
  }

  const contentInfo: ContentinfoTypes = {
    search: SearchDescriptions,
    indicator: IndicatorDescriptions,
    portfolio: PortfolioDescriptions,
    compensation: CompensationDescriptions,
    alert: AlertDescriptions,
    cbmdashboard: CbmdDescriptions,
  };

  const { title, description } = contentInfo[activeModule as keyof typeof contentInfo] ? contentInfo[activeModule][activeItem] : { title: '', description: '' };

  return (
    <div className="menuline">
      <menu>
        <button
          type="button"
          className={`btnhome btn1 ${(activeItem === 'queEs') ? 'active' : ''}`}
          onClick={() => setActiveItem( 'queEs' )}
        >
          <b>
            01
          </b>
          {' ¿Qué es?'}
        </button>
        <button
          type="button"
          className={`btnhome btn2 ${(activeItem === 'porque') ? 'active' : ''}`}
          onClick={() => setActiveItem('porque' )}
        >
          <b>
            02
          </b>
          {' ¿Por qué?'}
        </button>
        <button
          type="button"
          className={`btnhome btn3 ${(activeItem === 'quienProduce') ? 'active' : ''}`}
          onClick={() => setActiveItem('quienProduce' )}
        >
          <b>
            03
          </b>
          {' ¿Quién produce?'}
        </button>
        <button
          type="button"
          className={`btnhome btn4 ${(activeItem === 'queEncuentras') ? 'active' : ''}`}
          onClick={() => setActiveItem('queEncuentras' )}
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

// class Information2 extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       activeItem: 'queEs',
//     };
//     this.contentInfo = {
//       search: SearchDescriptions,
//       indicator: IndicatorDescriptions,
//       portfolio: PortfolioDescriptions,
//       compensation: CompensationDescriptions,
//       alert: AlertDescriptions,
//       cbmdashboard: CbmdDescriptions,
//     };
//   }

//   static getDerivedStateFromProps(nextProps) {
//     return { activeModule: nextProps.activeModule };
//   }

//   render() {
//     const { activeModule } = this.props;
//     const { activeItem } = this.state;
//     const { title, description } = this.contentInfo[activeModule] ? this.contentInfo[activeModule][activeItem] : { title: 'HOLI', description: 'HACHE' };
//     return (
//       <div className="menuline">
//         <menu>
//           <button
//             type="button"
//             className={`btnhome btn1 ${(activeItem === 'queEs') ? 'active' : ''}`}
//             onClick={() => this.setState({ activeItem: 'queEs' })}
//           >
//             <b>
//               01
//             </b>
//             {' ¿Qué es?'}
//           </button>
//           <button
//             type="button"
//             className={`btnhome btn2 ${(activeItem === 'porque') ? 'active' : ''}`}
//             onClick={() => this.setState({ activeItem: 'porque' })}
//           >
//             <b>
//               02
//             </b>
//             {' ¿Por qué?'}
//           </button>
//           <button
//             type="button"
//             className={`btnhome btn3 ${(activeItem === 'quienProduce') ? 'active' : ''}`}
//             onClick={() => this.setState({ activeItem: 'quienProduce' })}
//           >
//             <b>
//               03
//             </b>
//             {' ¿Quién produce?'}
//           </button>
//           <button
//             type="button"
//             className={`btnhome btn4 ${(activeItem === 'queEncuentras') ? 'active' : ''}`}
//             onClick={() => this.setState({ activeItem: 'queEncuentras' })}
//           >
//             <b>
//               04
//             </b>
//             {' ¿Qué encuentras?'}
//           </button>
//         </menu>
//         <div className={`${activeModule}`}>
//           <div className={`content ${activeItem}`}>
//             <h1>
//               {title}
//             </h1>
//             {description}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// Information.propTypes = {
//   activeModule: PropTypes.string,
// };

// Information.defaultProps = {
//   activeModule: '',
// };

export default Information;
