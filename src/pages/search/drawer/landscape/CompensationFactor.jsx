import InfoIcon from '@mui/icons-material/Info';
import React from 'react';

import GraphLoader from 'components/charts/GraphLoader';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import {
  cfTexts,
  BiomesText,
  BioticRegionsText,
} from 'pages/search/drawer/landscape/compensationFactor/InfoTexts';
import SearchContext from 'pages/search/SearchContext';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import TextBoxes from 'components/TextBoxes';

const {
  info: cFInfo,
  meto: cfMeto,
  quote: cfQuote,
  cons: cfCons,
} = cfTexts;

const {
  info: bInfo,
  meto: bMeto,
  quote: bQuote,
  cons: bCons,
} = BiomesText;

const {
  info: brInfo,
  meto: brMeto,
  quote: brQuote,
  cons: brCons,
} = BioticRegionsText;

class CompensationFactor extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      infoShown: new Set(['cf']),
      biomes: [],
      fc: [],
      bioticUnits: [],
      messages: {
        fc: 'loading',
        biomes: 'loading',
        bioticUnits: 'loading',
      },
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
      switchLayer,
    } = this.context;

    if (areaId !== 'ea') return;

    switchLayer('fc');

    RestAPI.requestBiomes(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState((prev) => ({
            biomes: this.processData(res),
            messages: {
              ...prev.messages,
              biomes: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            biomes: 'no-data',
          },
        }));
      });

    RestAPI.requestCompensationFactor(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState((prev) => ({
            fc: this.processData(res),
            messages: {
              ...prev.messages,
              fc: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            fc: 'no-data',
          },
        }));
      });

    RestAPI.requestBioticUnits(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState((prev) => ({
            bioticUnits: this.processData(res),
            messages: {
              ...prev.messages,
              bioticUnits: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            bioticUnits: 'no-data',
          },
        }));
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  toggleInfo = (value) => {
    this.setState((prev) => {
      const newState = prev;
      if (prev.infoShown.has(value)) {
        newState.infoShown.delete(value);
        return newState;
      }
      newState.infoShown.add(value);
      return newState;
    });
  }

  /**
   * Transform data to fit in the graph structure
   * @param {array} data data to be transformed
   *
   * @returns {array} data transformed
   */
  processData = (data) => {
    if (!data) return [];
    return data.map((obj) => ({
      key: `${obj.key}`,
      area: parseFloat(obj.area),
      label: `${obj.key}`,
    }));
  };

  render() {
    const {
      infoShown,
      biomes,
      fc,
      bioticUnits,
      messages: {
        fc: fcMess,
        biomes: biomesMess,
        bioticunits: bioticUnitsMess,
      },
    } = this.state;
    const {
      areaId,
      geofenceId,
    } = this.context;

    return (
      <div style={{ width: '100%' }}>
        <div className="graphcardAcc pt6 ml10">
          <h2>
            Factor de Compensación
          </h2>
          <div className="graphinfobox">
            <IconTooltip title="Interpretación">
              <InfoIcon
                className={`graphinfo${infoShown.has('cf') ? ' activeBox' : ''}`}
              />
            </IconTooltip>
            {infoShown.has('cf') && (
              <ShortInfo
                description={cFInfo}
                className="graphinfo2"
                collapseButton={false}
              />
            )}
          </div>
          <GraphLoader
            graphType="LargeBarStackGraph"
            data={fc}
            message={fcMess}
            labelX="Hectáreas"
            labelY="Factor de Compensación"
            units="ha"
            colors={matchColor('fc')}
            padding={0.25}
          />
          <TextBoxes
            consText={cfCons}
            metoText={cfMeto}
            quoteText={cfQuote}
            downloadData={fc}
            downloadName={`compensation_factor_${areaId}_${geofenceId}.csv`}
            isInfoOpen={infoShown.has('cf')}
            toggleInfo={() => this.toggleInfo('cf')}
          />
          <h3>
            Biomas
          </h3>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`downSpecial${infoShown.has('biomes') ? ' activeBox' : ''}`}
              onClick={() => this.toggleInfo('biomes')}
            />
          </IconTooltip>
          {infoShown.has('biomes') && (
            <ShortInfo
              description={bInfo}
              className="graphinfo3"
              collapseButton={false}
            />
          )}
          <GraphLoader
            graphType="LargeBarStackGraph"
            data={biomes}
            message={biomesMess}
            labelX="Hectáreas"
            labelY="Biomas"
            units="ha"
            colors={matchColor('biomas')}
            padding={0.3}
          />
          <TextBoxes
            consText={bCons}
            metoText={bMeto}
            quoteText={bQuote}
            downloadData={biomes}
            downloadName={`biomes_${areaId}_${geofenceId}.csv`}
            isInfoOpen={infoShown.has('biomes')}
            toggleInfo={() => this.toggleInfo('biomes')}
          />
          <h3>
            Regiones Bióticas
          </h3>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`downSpecial${infoShown.has('bioticReg') ? ' activeBox' : ''}`}
              onClick={() => this.toggleInfo('bioticReg')}
            />
          </IconTooltip>
          {infoShown.has('bioticReg') && (
            <ShortInfo
              description={brInfo}
              className="graphinfo3"
              collapseButton={false}
            />
          )}
          <GraphLoader
            graphType="LargeBarStackGraph"
            data={bioticUnits}
            message={bioticUnitsMess}
            labelX="Hectáreas"
            labelY="Regiones Bióticas"
            units="ha"
            colors={matchColor('bioticReg')}
            padding={0.3}
          />
          <TextBoxes
            consText={brCons}
            metoText={brMeto}
            quoteText={brQuote}
            downloadData={bioticUnits}
            downloadName={`biotic_units_${geofenceId}.csv`}
            isInfoOpen={infoShown.has('bioticReg')}
            toggleInfo={() => this.toggleInfo('bioticReg')}
          />
        </div>
      </div>
    );
  }
}

export default CompensationFactor;

CompensationFactor.contextType = SearchContext;
