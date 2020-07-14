import React from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import LandscapeAccordion from '../commons/LandscapeAccordion';
import CompensationFactor from '../search/CompensationFactor';
import HumanFootprint from '../search/HumanFootprint';

class Landscape extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedLevel1: 'fc',
      expandedLevel2: 'hfCurrent',
    };
  }

  componentDidMount() {
    const { handlerSwitchLayer } = this.props;
    handlerSwitchLayer('fc');
  }

  /**
   * Transform data to fit in the graph structure
   *
   * @param {string} level accordion level
   * @param {string} expandedTab accordion tab to be expanded or hidden
   *
   */
  handlerAccordionGeometry = (level, expandedTab) => {
    const { handlerSwitchLayer } = this.props;
    const { expandedLevel1, expandedLevel2 } = this.state;

    switch (level) {
      case '1':
        this.setState({ expandedLevel1: expandedTab });
        if (expandedTab === 'hf') {
          handlerSwitchLayer(expandedLevel2);
        } else {
          handlerSwitchLayer(expandedTab);
        }
        break;
      case '2':
        this.setState({ expandedLevel2: expandedTab });
        if (expandedTab === null) {
          handlerSwitchLayer(expandedLevel1);
        } else {
          handlerSwitchLayer(expandedTab);
        }
        break;
      default:
        handlerSwitchLayer(null);
    }
  }

  render() {
    const {
      fc,
      biomas,
      distritos,
      hfCurrent,
      hfCurrentValue,
      hfPersistence,
      hfTimeline,
      areaName,
      matchColor,
      timelineHFArea,
      handlerClickOnGraph,
    } = this.props;
    const componentsArray = [
      {
        label: {
          id: 'fc',
          name: 'FC y Biomas',
          disabled: false,
          expandIcon: <AddIcon />,
          detailId: 'Factor de compensación en área de consulta',
          description: 'Representa el coeficiente de relación entre BiomasIAvH y regiones bióticas',
        },
        component: <CompensationFactor
          areaName={areaName}
          biomesData={biomas}
          bioticRegionsData={distritos}
          compensationFactorData={fc}
          matchColor={matchColor}
        />,
      },
      {
        label: {
          id: 'hf',
          name: 'Huella humana',
          disabled: false,
          expandIcon: <AddIcon />,
          detailId: 'Huella humana en el área',
          description: 'Representa diferentes análisis de huella humana en esta área de consulta',
        },
        component: (
          <HumanFootprint
            hfCurrent={hfCurrent}
            hfCurrentValue={hfCurrentValue}
            hfPersistence={hfPersistence}
            hfTimeline={hfTimeline}
            timelineHFArea={timelineHFArea}
            handlerClickOnGraph={handlerClickOnGraph}
            handlerAccordionGeometry={this.handlerAccordionGeometry}
          />
        ),
      },
    ];
    return (
      <LandscapeAccordion
        componentsArray={componentsArray}
        classNameDefault="m0b"
        classNameSelected="m0b selector-expanded"
        handlerAccordionGeometry={this.handlerAccordionGeometry}
        level="1"
      />
    );
  }
}

Landscape.propTypes = {
  fc: PropTypes.array,
  biomas: PropTypes.array,
  distritos: PropTypes.array,
  hfCurrent: PropTypes.array,
  hfCurrentValue: PropTypes.number,
  hfPersistence: PropTypes.array,
  hfTimeline: PropTypes.array,
  areaName: PropTypes.string,
  matchColor: PropTypes.func,
  timelineHFArea: PropTypes.object,
  handlerSwitchLayer: PropTypes.func,
  handlerClickOnGraph: PropTypes.func,
};

Landscape.defaultProps = {
  fc: [],
  biomas: [],
  distritos: [],
  hfCurrent: [],
  hfCurrentValue: 0,
  hfPersistence: [],
  hfTimeline: [],
  areaName: '',
  matchColor: () => {},
  timelineHFArea: {},
  handlerSwitchLayer: () => {},
  handlerClickOnGraph: () => {},
};

export default Landscape;
